# for flask 
from flask import Flask 
app = Flask(__name__)


@app.route('/')
def index():
    return "hello World, will be creating new stuff, he he e"


if __name__ == "__main__":
    app.run(debug=True)
