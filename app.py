    from flask import Flask, render_template, jsonify, request, redirect, url_for, session
    from flask_sqlalchemy import SQLAlchemy
    from dotenv import load_dotenv
    import os
    import bcrypt
    from datetime import datetime

    load_dotenv()
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy
    db = SQLAlchemy(app)

    # Define User model
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password = db.Column(db.String(255), nullable=False)
        username = db.Column(db.String(80), nullable=False)
        created_at = db.Column(db.DateTime, server_default=db.func.now())
        bio = db.Column(db.Text, nullable=True)
        is_private = db.Column(db.Boolean, default=False)  # Privacy setting

    # Define Friendship model
    class Friendship(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Create database tables
    with app.app_context():
        db.create_all()

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':
            email = request.form.get('email')
            password = request.form.get('password')
            username = request.form.get('username')

            # Restrict to @drexel.edu emails
            if not email.endswith('@drexel.edu'):
                return jsonify({'error': 'Email must be a valid @drexel.edu address'}), 400

            # Check if email already exists
            if User.query.filter_by(email=email).first():
                return jsonify({'error': 'Email already registered'}), 400

            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Create new user
            new_user = User(
                email=email,
                password=hashed_password.decode('utf-8'),
                username=username
            )
            db.session.add(new_user)
            db.session.commit()

            return redirect(url_for('login'))

        return render_template('signup.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form.get('email')
            password = request.form.get('password')

            # Fetch user
            user = User.query.filter_by(email=email).first()

            if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                session['user_id'] = user.id
                session['username'] = user.username
                return redirect(url_for('dashboard'))
            else:
                return jsonify({'error': 'Invalid credentials'}), 401

        return render_template('login.html')

    @app.route('/dashboard')
    def dashboard():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        user = User.query.get(session['user_id'])
        return render_template('dashboard.html', username=user.username, bio=user.bio)

    @app.route('/logout')
    def logout():
        session.pop('user_id', None)
        session.pop('username', None)
        return redirect(url_for('home'))

    @app.route('/profile', methods=['GET', 'POST'])
    def profile():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        user = User.query.get(session['user_id'])
        if request.method == 'POST':
            bio = request.form.get('bio')
            user.bio = bio
            db.session.commit()
            return redirect(url_for('dashboard'))
        return render_template('profile.html', username=user.username, bio=user.bio)

    @app.route('/privacy', methods=['GET', 'POST'])
    def privacy():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        user = User.query.get(session['user_id'])
        if request.method == 'POST':
            is_private = 'is_private' in request.form
            user.is_private = is_private
            db.session.commit()
            return redirect(url_for('dashboard'))
        return render_template('privacy.html', is_private=user.is_private)

    @app.route('/connect', methods=['GET', 'POST'])
    def connect():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        current_user = User.query.get(session['user_id'])
        if request.method == 'POST':
            search_query = request.form.get('search')
            users = User.query.filter(
                User.username.ilike(f'%{search_query}%')
            ).filter(User.id != session['user_id']).filter(User.is_private == False).all()
        else:
            users = User.query.filter(User.id != session['user_id']).filter(User.is_private == False).all()
        return render_template('friendslist.html', users=users, current_user=current_user)

    @app.route('/add_friend/<int:friend_id>')
    def add_friend(friend_id):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        friendship = Friendship(user_id=session['user_id'], friend_id=friend_id)
        db.session.add(friendship)
        db.session.commit()
        return redirect(url_for('connect'))

    @app.route('/friends')
    def friends():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        friendships = Friendship.query.filter_by(user_id=session['user_id']).all()
        friend_ids = [f.friend_id for f in friendships]
        friends = User.query.filter(User.id.in_(friend_ids)).all()
        return render_template('friendslist.html', friends=friends)

    @app.route('/api/message', methods=['GET'])
    def get_message():
        return jsonify({"message": "Welcome to DragonsConnect!"})

    if __name__ == '__main__':
        app.run(debug=True)