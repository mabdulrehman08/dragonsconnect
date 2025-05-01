import json
from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from functools import wraps
from werkzeug.exceptions import HTTPException
from flask_sqlalchemy import SQLAlchemy

# Load environment variables from .env file
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY", "27ad10a8fed2439ffed2d72cce95fd45")

# Configure database - using your existing connection string
app.config['SQLALCHEMY_DATABASE_URI'] = env.get("DATABASE_URL", 'postgresql://postgres:8marchismybirthday@localhost/dragonsconnect')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure Auth0
oauth = OAuth(app)
oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

# User Model - using your existing User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    auth0_id = db.Column(db.String(120), unique=True, nullable=False)  # Add this field to your model

# Decorator to check if user is logged in
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'profile' not in session:
            # Redirect to Login page
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated

# Routes - preserving your existing routes but adding Auth0 login
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route('/callback')
def callback():
    # Process the callback from Auth0
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    
    # Get user profile information
    userinfo = token.get('userinfo')
    session['profile'] = {
        'user_id': userinfo['sub'],
        'email': userinfo.get('email', ''),
        'name': userinfo.get('name', '')
    }
    
    # Check if user exists in database, if not create them
    auth0_id = userinfo['sub']
    user = User.query.filter_by(auth0_id=auth0_id).first()
    
    if not user:
        # Create a new user
        username = userinfo.get('nickname', '').lower() or userinfo.get('name', '').lower().replace(' ', '_')
        email = userinfo.get('email', '')
        
        # Make sure username is unique
        base_username = username
        count = 1
        while User.query.filter_by(username=username).first():
            username = f"{base_username}{count}"
            count += 1
        
        user = User(auth0_id=auth0_id, email=email, username=username)
        db.session.add(user)
        
        try:
            db.session.commit()
            flash('Your account has been created!', 'success')
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error creating user: {str(e)}")
            flash('An error occurred during registration. Please try again.', 'error')
    
    # Store the user's database ID in the session for easy access
    session['user_id'] = user.id
    
    return redirect('/profile')

@app.route('/logout')
@requires_auth
def logout():
    # Clear session stored data
    session.clear()
    
    # Redirect user to logout endpoint
    params = {
        'returnTo': url_for('index', _external=True),
        'client_id': env.get('AUTH0_CLIENT_ID')
    }
    return redirect(f"https://{env.get('AUTH0_DOMAIN')}/v2/logout?{urlencode(params)}")

@app.route('/profile')
@requires_auth
def profile():
    # Get user info from database
    user = User.query.get(session.get('user_id'))
    
    return render_template('profile.html', user=user)

@app.route('/modify', methods=['GET', 'POST'])
@requires_auth
def modify():
    user = User.query.get(session.get('user_id'))
    
    if request.method == 'POST':
        # Get form data
        new_username = request.form.get('username')
        
        # Validate username
        if new_username != user.username:
            existing_user = User.query.filter_by(username=new_username).first()
            if existing_user:
                flash('That username is already taken.', 'error')
                return render_template('Modifying.html', user=user)  # Using your template name
        
        # Update user information
        user.username = new_username
        
        try:
            db.session.commit()
            flash('Your profile has been updated!', 'success')
            return redirect('/profile')
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error updating user: {str(e)}")
            flash('An error occurred while updating your profile.', 'error')
    
    return render_template('Modifying.html', user=user)  # Using your template name

@app.route('/services')
def services():
    return render_template('services.html')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=env.get('PORT', 5000))