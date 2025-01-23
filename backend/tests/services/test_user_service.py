import pytest
from src.services.user_service import UserService
from src.models.user import User
from src.database import db


@pytest.fixture
def user_service():
    return UserService()


def test_get_or_create_user_creates_new_user(app, user_service):
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User"
    }

    user = user_service.get_or_create_user(user_data)

    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert User.query.count() == 1


def test_get_or_create_user_retrieves_existing_user(app, user_service):
    # add existing user to db
    existing_user = User(email="test@example.com", full_name="Test User")
    db.session.add(existing_user)
    db.session.commit()

    user_data = {
        "email": "test@example.com",
        "full_name": "Test User"
    }

    user = user_service.get_or_create_user(user_data)

    assert user.id == existing_user.id
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert User.query.count() == 1


def test_get_or_create_user_empty_email_raises_error(app, user_service):
    user_data = {
        "email": "",
        "full_name": "Test User"
    }

    with pytest.raises(ValueError, match="Email is required"):
        user_service.get_or_create_user(user_data)


def test_get_or_create_user_invalid_data_raises_error(app, user_service):
    invalid_data = "not a dictionary"

    with pytest.raises(ValueError, match="Invalid user data format"):
        user_service.get_or_create_user(invalid_data)


def test_get_or_create_with_different_names(app, user_service):
    # create user with name "First Name"
    user_data1 = {
        "email": "test@example.com",
        "full_name": "First Name"
    }
    user1 = user_service.get_or_create_user(user_data1)
    db.session.commit()

    # get/create user with same email but different name
    user_data2 = {
        "email": "test@example.com",
        "full_name": "Second Name"
    }
    user2 = user_service.get_or_create_user(user_data2)
    db.session.commit()

    assert user1.id == user2.id
    assert user2.full_name == "Second Name"  # name should be updated
    assert User.query.count() == 1


def test_validation_errors(app, user_service):
    invalid_cases = [
        (
            {"email": "invalid-email", "full_name": "Test User"},
            "Invalid email format"
        ),
        (
            {"email": "test@example.com", "full_name": ""},
            "Full name is required"
        ),
        (
            {"email": "test@example.com", "full_name": "a"},
            "Full name must be at least 2 characters"
        ),
    ]

    for data, expected_error in invalid_cases:
        with pytest.raises(ValueError, match=expected_error):
            user_service.get_or_create_user(data)
