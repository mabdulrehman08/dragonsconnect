import sqlite3
import click
from flask import current_app, g

def get_db():
    """Connect to the database and return the connection."""
    if 'db' not in g:
        # Create a new connection if one doesn't exist
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        # Configure the connection to return rows as dictionaries
        g.db.row_factory = sqlite3.Row

    return g.db

def close_db(e=None):
    """Close the database connection if it exists."""
    db = g.pop('db', None)
    
    # Only close if a connection was created
    if db is not None:
        db.close()

def init_db():
    """Initialize the database with schema."""
    db = get_db()
    
    # Execute SQL commands from schema.sql
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    """Command to clear existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    """Register database functions with the Flask app."""
    # Ensure db connections are closed after responses
    app.teardown_appcontext(close_db)
    # Add the init-db command to Flask CLI
    app.cli.add_command(init_db_command)