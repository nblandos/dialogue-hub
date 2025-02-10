import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # only use azure if the environment variable is set
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'AZURE_DATABASE_URL', 'sqlite:///local.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

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
