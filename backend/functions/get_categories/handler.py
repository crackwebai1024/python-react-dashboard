import json
import os
import logging
from plaid import Client

from modules import parameters
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def get_categories():

    config = parameters.get_plaid_config()
    client = Client(client_id=config['client_id'],
                    secret=config['client_secret'], public_key=config['public_key'], environment='sandbox')

    try:
        response = client.Transactions.get(
            config['default_access_token'], start_date='2016-07-12', end_date='2020-01-09')

        transactions = response['transactions']
        logger.info(f'got transactions: {transactions}')

    except Exception as e:
        logger.info(f'unable to get transactions: {e}')
        return []

    return transactions


def handler(event, context):

    response = {
        "statusCode": 200,
        "body": None,
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    transactions = get_categories()
    response["body"] = json.dumps(transactions)

    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/get_categories.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
