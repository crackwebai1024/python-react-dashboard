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


def get_feed(mysql_conn):

    cursor = mysql_conn.cursor()

    try:
        cursor.execute('SELECT entry_id, title, income, location, occupation, social_spending.entries.db_created_at FROM social_spending.entries \
                        INNER JOIN social_spending.users on social_spending.users.sub = social_spending.entries.sub')

    except Exception as e:
        logger.info(str(e))
        cursor.close()
        return False

    feed = cursor.fetchall()
    cursor.close()

    # if an entry doesn't exist yet, bail
    if not feed:
        logger.info('entries not found')
        return []

    return feed


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

    feed = get_feed(mysql_conn)

    arr = []

    for i in feed:

        body = {}

        body['entry_id'] = i['entry_id']
        body['title'] = i['title']
        body['income'] = i['income']
        body['occupation'] = i['occupation']
        body['location'] = i['location']
        body['date'] = i['db_created_at'].timestamp()

        logger.info(i)
        arr.append(body)

    logger.info(arr)
    response['body'] = json.dumps(arr, default=datetime_handler)
    return response


if __name__ == '__main__':
    event = {'body': {}}

    with open('./test_events/get_feed.json', 'r') as f_in:
        event = json.loads(f_in.read())
        handler(event, {})
