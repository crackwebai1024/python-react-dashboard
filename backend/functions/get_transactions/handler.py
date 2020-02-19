import json
import os
import logging
from plaid import Client

from modules import parameters
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def get_transactions(access_token):

    config = parameters.get_plaid_config()
    client = Client(client_id=config['client_id'],
                    secret=config['client_secret'], public_key=config['public_key'], environment='sandbox')

    try:
        response = client.Transactions.get(
            access_token, start_date='2016-07-12', end_date='2020-01-09')

        transactions = response['transactions']
        logger.info(f'got transactions: {transactions}')

    except Exception as e:
        logger.info(f'unable to get transactions: {e}')
        return []

    return transactions


def get_access_token(sub):

    mysql_conn = db.connect_to_db()
    cursor = mysql_conn.cursor()

    try:
        cursor.execute('SELECT plaid_token FROM users WHERE sub=(%s);',
                       (sub,))

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    access_token = cursor.fetchone()

    logger.info('found access token: {access_token}')
    cursor.close()

    return access_token


def handler(event, context):

    response = {
        "statusCode": 200,
        "body": None,
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    # sub = event_body.get('sub', {})
    sub = event['requestContext']['authorizer']['claims']['sub']

    stored_token = get_access_token(sub)
    access_token = stored_token['plaid_token']
    logger.info(f'access: {access_token}')
    if not access_token:
        response['body'] = 'unable to get access token'
        return response

    transactions = get_transactions(access_token)
    response["body"] = json.dumps(transactions)

    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/get_transactions.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
