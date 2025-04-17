from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

# Create a Blueprint for authentication routes
bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=('GET', 'POST'))
def register():
    """Register a new user."""
    if request.method == 'POST':
        # Get form input
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        
        # Validate input
        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        
        # Create new user if validation passes
        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                # Username already exists
                error = f"User {username} is already registered."
            else:
                # Redirect to login page after successful registration
                return redirect(url_for("auth.login"))
        
        # Show error message if validation fails
        flash(error)
    
    # Show registration form
    return render_template('auth/register.html')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    """Log in a registered user."""
    if request.method == 'POST':
        # Get form input
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        
        # Fetch user from database
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()
        
        # Validate credentials
        if user is None:
            error = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'
        
        # Store user ID in session if validation passes
        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))
        
        # Show error message if validation fails
        flash(error)
    
    # Show login form
    return render_template('auth/login.html')

@bp.before_app_request
def load_logged_in_user():
    """Load logged in user information before each request."""
    user_id = session.get('user_id')
    
    # Set g.user based on session
    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

@bp.route('/logout')
def logout():
    """Log out by clearing the session."""
    session.clear()
    return redirect(url_for('index'))