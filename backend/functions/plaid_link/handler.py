import json
import os
import logging
from plaid import Client

from modules import parameters
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def token_exchange(sub, public_token):

    config = parameters.get_plaid_config()

    plaid_token = None

    client = Client(client_id=config['client_id'],
                    secret=config['client_secret'], public_key=config['public_key'], environment='sandbox')

    try:
        response = client.Item.public_token.exchange(public_token)
        access_token = response['access_token']
        logger.info(f'got access token: {access_token}')

        if access_token:
            plaid_token = access_token

    except Exception as e:
        logger.info(f'unable to exchange public token: {e}')

    return plaid_token


def insert_token_in_db(sub, access_token):

    mysql_conn = db.connect_to_db()
    cursor = mysql_conn.cursor()

    try:
        cursor.execute(f'UPDATE users SET plaid_token=(%s) WHERE sub=(%s);',
                       (access_token, sub,))

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    mysql_conn.commit()
    cursor.close()

    return True


def handler(event, context):

    logger.info(event)

    response = {
        "statusCode": 200,
        "body": None,
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    event_body = event.get('body', {})
    if isinstance(event_body, str):
        event_body = json.loads(event_body)

    logger.info(event_body)
    public_token = event_body.get('public_token', {})

    logger.info(public_token)
    # sub = event_body.get('sub', {})

    sub = event['requestContext']['authorizer']['claims']['sub']

    access_token = token_exchange(sub, public_token)
    if access_token is None:
        logger.info(f'undefined access token, exiting')
        return False

    update_user = insert_token_in_db(sub, access_token)
    if not update_user:
        response["body"] = 'error'
        return response

    response["body"] = json.dumps(access_token)
    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/plaid_link.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
