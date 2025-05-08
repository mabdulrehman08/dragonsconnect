import os
from flask import Flask, Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
from dragonconnect.db import get_db, init_app
#from dragonsconnect.blog import bp as blog_bp #app doesn't run unless we do this later
#from dragonsconnect.profile import bp as profile_bp #profile.py is empty. why is this here
from dotenv import load_dotenv
from functools import wraps
import jwt
from jose import jwt as jose_jwt
import requests

load_dotenv()

# Auth0 Configuration
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
AUTH0_AUDIENCE = os.getenv('AUTH0_AUDIENCE')
AUTH0_JWKS_URI = f'https://{AUTH0_DOMAIN}/.well-known/jwks.json'

# Cache JWKS for token validation
jwks = requests.get(AUTH0_JWKS_URI).json()

# Decorator to require Auth0 authentication
def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split('Bearer ')[-1]
            elif 'auth0_access_token' in session:
                token = session.get('auth0_access_token')

            if not token:
                return jsonify({'message': 'Token is missing'}), 401

            try:
                unverified_header = jwt.get_unverified_header(token)
                rsa_key = {}
                for key in jwks['keys']:
                    if key['kid'] == unverified_header['kid']:
                        rsa_key = {
                            'kty': key['kty'],
                            'kid': key['kid'],
                            'use': key['use'],
                            'n': key['n'],
                            'e': key['e']
                        }
                if rsa_key:
                    payload = jose_jwt.decode(
                        token,
                        rsa_key,
                        algorithms=['RS256'],
                        audience=AUTH0_AUDIENCE,
                        issuer=f'https://{AUTH0_DOMAIN}/'
                    )
                    g.auth0_payload = payload
                    if permission:
                        scopes = payload.get('scope', '').split()
                        if permission not in scopes:
                            return jsonify({'message': 'Permission denied'}), 403
                else:
                    return jsonify({'message': 'Invalid token'}), 401
            except Exception as e:
                return jsonify({'message': f'Token validation failed: {str(e)}'}), 401

            return f(*args, **kwargs)
        return decorated
    return requires_auth_decorator

# Define the auth Blueprint
bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

@bp.route('/login/auth0')
def login_auth0():
    redirect_uri = url_for('auth.callback_auth0', _external=True)
    return redirect(
        f'https://{AUTH0_DOMAIN}/authorize?'
        f'response_type=code&'
        f'client_id={AUTH0_CLIENT_ID}&'
        f'redirect_uri={redirect_uri}&'
        f'scope=openid profile email { " ".join(["read:posts", "create:posts", "update:posts", "delete:posts"]) }&'
        f'audience={AUTH0_AUDIENCE}'
    )

@bp.route('/callback/auth0')
def callback_auth0():
    code = request.args.get('code')
    token_url = f'https://{AUTH0_DOMAIN}/oauth/token'
    token_payload = {
        'grant_type': 'authorization_code',
        'client_id': AUTH0_CLIENT_ID,
        'client_secret': AUTH0_CLIENT_SECRET,
        'code': code,
        'redirect_uri': url_for('auth.callback_auth0', _external=True),
    }
    headers = {'Content-Type': 'application/json'}
    token_response = requests.post(token_url, json=token_payload, headers=headers).json()
    access_token = token_response.get('access_token')
    id_token = token_response.get('id_token')

    user_info = jose_jwt.decode(
        id_token,
        jwks,
        algorithms=['RS256'],
        audience=AUTH0_CLIENT_ID,
        issuer=f'https://{AUTH0_DOMAIN}/'
    )
    email = user_info['email']
    username = user_info['nickname']
    db = get_db()

    user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
    if not user:
        db.execute(
            'INSERT INTO user (username, email) VALUES (?, ?)',
            (username, email),
        )
        db.commit()
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()

    session.clear()
    session['user_id'] = user['id']
    session['auth0_access_token'] = access_token
    return redirect(url_for('blog.index'))

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('blog.index'))

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev'),
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    init_app(app)
    from . import blog
    from . import auth
    app.register_blueprint(auth.bp)  # auth Blueprint
    app.register_blueprint(blog.bp)  # blog Blueprint
    #app.register_blueprint(profile_bp)  # profile Blueprint
    return app