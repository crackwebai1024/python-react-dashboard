
import pymysql
import logging
import os
import sys

from modules import parameters

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def connect_to_db():
    config = parameters.get_mysql_config()

    try:
        conn = pymysql.connect(
            config['hostname'],
            user=config['username'],
            passwd=config['password'],
            db=config['db'],
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=5
        )
    except:
        logger.error("ERROR: Unexpected error: \
            Could not connect to MySql instance.")
        sys.exit()

    logging.info("Connected to database: {}".format(config['db']))

    return conn
