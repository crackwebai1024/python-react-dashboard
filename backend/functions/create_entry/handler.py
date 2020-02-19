import json
import os
import logging
import uuid

from modules import parameters
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def create_entry(mysql_conn, sub, title):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE sub=%s;',
                       (sub, ))
    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    user_exists = cursor.fetchone()

    if not user_exists:
        logger.info(f'user not found, exiting: {user_exists}')
        return False

    # create random uuid as identifier for our new entry
    entry_id = str(uuid.uuid4())
    logger.info(entry_id)

    try:
        cursor.execute('INSERT INTO entries(entry_id, sub, title) VALUES(%s,%s,%s);',
                       (entry_id, sub, title,))

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    mysql_conn.commit()
    cursor.close()

    return entry_id


def insert_transaction(mysql_conn, transaction):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute('INSERT INTO transactions(entry_id, name, date, amount, category, notes, source ) VALUES(%s,%s,%s,%s,%s,%s,%s);',
                       (transaction['entry_id'], transaction['name'], transaction['date'], transaction['amount'], transaction['category'], transaction['notes'], transaction['source'],))
    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    mysql_conn.commit()
    cursor.close()

    return True


def handler(event, context):

    mysql_conn = db.connect_to_db()

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

    # sub = event_body.get('sub', {})
    sub = event['requestContext']['authorizer']['claims']['sub']

    # create entry
    title = event_body.get('title', {})
    entry_id = create_entry(mysql_conn, sub, title)

    # insert transactions
    transactions = event_body.get('transactions', [])
    for i in transactions:

        transaction = {}

        transaction['entry_id'] = entry_id
        transaction['name'] = i.get('name', {})
        transaction['date'] = i.get('date', {})
        transaction['amount'] = i.get('amount', {})
        transaction['category'] = i.get('category', {})
        transaction['notes'] = i.get('notes', {})
        transaction['source'] = i.get('payment_channel', {})

        new_entry = insert_transaction(mysql_conn, transaction)
        logger.info(f'created entry: {new_entry}')

    message = {
        'entry_id': entry_id,
    }

    response["body"] = json.dumps(message)
    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/create_entry.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
