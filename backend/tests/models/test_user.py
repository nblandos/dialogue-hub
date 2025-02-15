import pytest
from datetime import datetime, timezone
from src.models.user import User
from src.models.booking import Booking, BookingStatus
from src.models.timeslot import Timeslot
from src import db


@pytest.fixture
def sample_datetime():
    return datetime(2024, 1, 1, 9, 0, tzinfo=timezone.utc)


@pytest.fixture
def user():
    return User(email="test@example.com", full_name="Test User")


@pytest.fixture
def timeslot(sample_datetime):
    return Timeslot(start_time=sample_datetime)


@pytest.fixture
def booking(user, timeslot):
    booking = Booking(user=user, status=BookingStatus.BOOKED)
    booking.timeslots.append(timeslot)
    return booking


def test_create_user(user):
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert user.bookings == []


def test_user_to_dict(app, user):
    db.session.add(user)
    db.session.commit()

    user_dict = user.to_dict()
    assert user_dict["email"] == "test@example.com"
    assert user_dict["full_name"] == "Test User"
    assert user_dict["bookings"] == []


def test_user_from_dict():
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User"
    }
    user = User.from_dict(user_data)
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"


def test_user_with_bookings(app, user, timeslot, booking):
    db.session.add(user)
    db.session.add(timeslot)
    db.session.add(booking)
    db.session.commit()

    user = db.session.get(User, user.id)
    assert len(user.bookings) == 1
    assert user.bookings[0].status == BookingStatus.BOOKED
    assert len(user.bookings[0].timeslots) == 1


def test_user_repr(user):
    assert repr(user) == f'<User {user.id} {user.email}>'


def test_user_default_values(app):
    user = User(email="test2@example.com", full_name="Test User 2")
    db.session.add(user)
    db.session.commit()

    assert user.email == "test2@example.com"
    assert user.full_name == "Test User 2"
    assert isinstance(user.created_at, datetime)
    assert user.bookings == []


def test_email_uniqueness(app):
    user1 = User(email="same@example.com", full_name="User 1")
    user2 = User(email="same@example.com", full_name="User 2")

    db.session.add(user1)
    db.session.commit()

    with pytest.raises(Exception):
        db.session.add(user2)
        db.session.commit()


def test_cascade_delete(app, user, booking):
    db.session.add(user)
    db.session.add(booking)
    db.session.commit()

    db.session.delete(user)
    db.session.commit()

    assert Booking.query.count() == 0


def test_user_validation_errors():
    test_cases = [
        (
            {"email": "invalid-email", "full_name": "Test"},
            "Invalid email format"
        ),
        (
            {"email": "test@example.com", "full_name": "A"},
            "Full name must be at least 2 characters"
        ),
        (
            {"email": "test@example.com", "full_name": "A" * 101},
            "Full name must be less than 100 characters"
        ),
        (
            {"email": "", "full_name": "Test"},
            "Email is required"
        ),
        (
            {"email": "test@example.com", "full_name": ""},
            "Full name is required"
        ),
    ]

    for data, expected_error in test_cases:
        with pytest.raises(ValueError, match=expected_error):
            User.from_dict(data)
