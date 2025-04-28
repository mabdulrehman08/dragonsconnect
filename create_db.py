# intiated database 
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")