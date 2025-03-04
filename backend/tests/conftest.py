import pytest
from src import db
from app import create_app
from src.config.config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    DEBUG = True
    MAIL_SUPPRESS_SEND = True


@pytest.fixture(scope="function")
def app():
    test_app = create_app(TestConfig)

    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()
