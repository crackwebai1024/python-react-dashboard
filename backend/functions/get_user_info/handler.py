import json
import os
import logging
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def get_user_info(sub):

    mysql_conn = db.connect_to_db()
    cursor = mysql_conn.cursor()

    try:
        cursor.execute(
            'SELECT id, username, sub, email, plaid_token FROM users WHERE sub=%s;', (sub,))
    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return []

    user_info = cursor.fetchone()
    cursor.close()

    if user_info:
        return user_info
    else:
        return []


def handler(event, context):

    response = {
        "statusCode": 200,
        "body": None,
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    sub = event['requestContext']['authorizer']['claims']['sub']

    found_user = get_user_info(sub)
    logger.info(f"Retrieved sub from DB: {found_user}")

    user_info = {
        'id': found_user['id'],
        'username': found_user['username'],
        'sub': found_user['sub'],
        'email': found_user['email'],
        'plaid_token': found_user['plaid_token']
    }

    response['body'] = json.dumps(user_info)

    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/get_user_info.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
