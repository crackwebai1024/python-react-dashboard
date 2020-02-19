import os


def get_mysql_config():
    config = {}

    # config['hostname'] = 'smartshare-experiments.chpryfodqoop.us-east-1.rds.amazonaws.com'
    # config['port'] = '3306'
    # config['username'] = 'llom2600'
    # config['password'] = 'S0v1ndiv!#!'
    # config['db'] = 'social_spending'

    config['hostname'] = os.getenv('MYSQL_HOST', '')
    config['port'] = os.getenv('MYSQL_PORT', '0')
    config['username'] = os.getenv('MYSQL_USER', '')
    config['password'] = os.getenv('MYSQL_PASS', '')
    config['db'] = os.getenv('MYSQL_NAME', '')

    return config


def get_plaid_config():
    config = {}

    # config['client_id'] = '5be83d9fd4530d0014d4a287'
    # config['client_secret'] = '5a051f20478de47fc55b0e33ffa325'
    # config['public_key'] = '5a051f20478de47fc55b0e33ffa325'
    # config['default_access_token'] = 'access-sandbox-69cc61f9-518e-465c-ba0b-b1603b0d4510'

    config['client_id'] = os.getenv('PLAID_CLIENT_ID', '')
    config['client_secret'] = os.getenv('PLAID_CLIENT_SECRET', '0')
    config['public_key'] = os.getenv('PLAID_PUBLIC_KEY', '')
    config['default_access_token'] = os.getenv('DEFAULT_ACCESS_TOKEN', '')

    return config
