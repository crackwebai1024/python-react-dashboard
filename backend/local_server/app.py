import json
from flask import Flask, jsonify

# Import your lambda function handlers here
from functions.get_user_info import handler as get_user_info
from functions.create_user import handler as create_user
# You can import reusable code from the modules directory
# from modules.example import *

app = Flask(__name__)


@app.route('/get_user_info')
def _get_user_info():

    test_event = {
        "sub": 1
    }

    test_context = {
    }

    response = get_user_info.get_user_info(test_event)
    return jsonify(response)


@app.route('/create_user')
def _create_user():

    test_event = {
    }

    test_context = {
    }

    response = create_user.create_user(test_event)
    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
