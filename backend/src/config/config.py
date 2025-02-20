import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Email configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('SENDER_EMAIL')
    MAIL_PASSWORD = os.getenv('SENDER_PASSWORD')

    # Azure OpenAI configuration
    KEY_VAULT_NAME = os.getenv('KEY_VAULT_NAME')
    OPENAI_API_SECRET_NAME = os.getenv('OPENAI_API_SECRET_NAME')
    OPENAI_ENDPOINT_URL = os.getenv('OPENAI_ENDPOINT_URL')
    DEPLOYMENT_NAME = os.getenv('DEPLOYMENT_NAME')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}/{dbname}'.format(
            dbuser=os.getenv('AZURE_POSTGRESQL_USER'),
            dbpass=os.getenv('AZURE_POSTGRESQL_PASSWORD'),
            dbhost=os.getenv('AZURE_POSTGRESQL_HOST'),
            dbname=os.getenv('AZURE_POSTGRESQL_NAME')
        )
    )
    PORT = 5000


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///local.db'
    DEBUG = True
    PORT = 5001
