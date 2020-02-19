import json
import os
import logging

from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def create_user(mysql_conn, user_data):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE sub=%s;',
                       (user_data['sub'], ))
    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    user_exists = cursor.fetchone()

    if user_exists:
        logger.info(f'user exists, exiting: {user_exists}')
        return False

    try:
        cursor.execute('INSERT INTO users(username, sub, email, user_pool_id, client_id, location, occupation, income ) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);',
                       (
                           user_data['username'], user_data['sub'], user_data['email'],
                           user_data['user_pool_id'], user_data['client_id'],
                           user_data['location'], user_data['occupation'], user_data['income'],))
    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    mysql_conn.commit()
    cursor.close()

    return True


def handler(event, context):

    logger.info(f'######: {event}')

    logger.info(event['userName'])

    mysql_conn = db.connect_to_db()

    user_data = {}

    try:
        user_data['username'] = event['userName']
        user_data['user_pool_id'] = event['userPoolId']
        user_data['client_id'] = event['callerContext']['clientId']
        user_data['sub'] = event['request']['userAttributes']['sub']
        user_data['email'] = event['request']['userAttributes']['email']
        # custom attributes
        user_data['location'] = event['request']['userAttributes']['custom:City']
        user_data['occupation'] = event['request']['userAttributes']['custom:Occupation']
        user_data['income'] = event['request']['userAttributes']['custom:Income']

        logger.info(f'user data: {user_data}')
        new_user = create_user(mysql_conn, user_data)

        if new_user:
            pass

    except Exception as e:
        logger.info(f'unable to create user: {e}')

    return event


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/create_user.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
