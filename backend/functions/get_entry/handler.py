import json
import os
import logging
import datetime
from modules import db

logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)


def datetime_handler(x):
    if hasattr(x, 'isoformat'):
        return x.isoformat()
    raise TypeError("Unknown type")


def get_entry(mysql_conn, entry_id):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute(f'SELECT entry_id, title, description, income, location, occupation, social_spending.entries.db_created_at \
                         FROM social_spending.entries \
                         INNER JOIN social_spending.users on social_spending.users.sub = social_spending.entries.sub \
                         WHERE entry_id=(%s);', (entry_id,))

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    found_entry = cursor.fetchone()
    cursor.close()

    # if an entry doesn't exist yet, bail
    if not found_entry:
        logger.info('entry not found')
        return False

    return found_entry


def get_transactions(mysql_conn, entry_id):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute(f'SELECT * FROM transactions WHERE entry_id=(%s);',
                       (entry_id,))

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    transactions = cursor.fetchall()
    cursor.close()

    return transactions


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

    entry = {}

    event_body = event.get('body', {})
    # sub = event['requestContext']['authorizer']['claims']['sub']

    if isinstance(event_body, str):
        event_body = json.loads(event_body)

    entry_id = event_body.get('entry_id', {})

    found_entry = get_entry(mysql_conn, entry_id)

    if found_entry:
        logger.info(f"Retrieved entry from DB: {found_entry}")

        entry['id'] = found_entry['entry_id']
        entry['title'] = found_entry['title']
        entry['description'] = found_entry['description']
        entry['income'] = found_entry['income']
        entry['occupation'] = found_entry['occupation']
        entry['location'] = found_entry['location']
        entry['date'] = found_entry['db_created_at'].timestamp()

        transactions = get_transactions(mysql_conn, entry_id)

        entry['transactions'] = transactions
        response['body'] = json.dumps(entry, default=datetime_handler)

    logger.info(response)
    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/get_entry.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
