import pytest
from datetime import datetime, date, timezone
from src.app import db
from src.models.booking import Booking
from src.models.user import User


@pytest.fixture
def test_user(app):
    user = User(
        full_name='Test User',
        email='test@example.com'
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def test_booking(test_user):
    booking = Booking(
        user_id=test_user.id,
        date=date(2025, 1, 1),
        start_time=datetime(2025, 1, 1, 10, 0, tzinfo=timezone.utc),
        end_time=datetime(2025, 1, 1, 12, 0, tzinfo=timezone.utc)
    )
    db.session.add(booking)
    db.session.commit()
    return booking


def test_create_booking(test_user):
    booking = Booking(
        user_id=test_user.id,
        date=date(2024, 3, 20),
        start_time=datetime(2025, 1, 2, 9, 0, tzinfo=timezone.utc),
        end_time=datetime(2025, 1, 2, 11, 0, tzinfo=timezone.utc),
    )
    db.session.add(booking)
    db.session.commit()

    assert booking.id is not None
    assert booking.user_id == test_user.id
    assert booking.status == "booked"
    assert booking.created_at is not None


def test_to_dict(test_booking):
    data = test_booking.to_dict()
    assert data["id"] == test_booking.id
    assert data["user_id"] == test_booking.user_id
    assert data["date"] == "2025-01-01"
    assert data["start_time"] == "2025-01-01T10:00:00"
    assert data["end_time"] == "2025-01-01T12:00:00"
    assert data["status"] == "booked"
    assert "created_at" in data


def test_from_dict():
    data = {
        "user_id": 1,
        "date": "2025-01-03",
        "start_time": "2025-01-03T11:00:00+00:00",
        "end_time": "2025-01-03T12:00:00+00:00",
        "status": "booked"
    }
    booking = Booking.from_dict(data)
    assert booking.user_id == 1
    assert booking.date == date(2025, 1, 3)
    assert booking.start_time == datetime(
        2025, 1, 3, 11, 0, tzinfo=timezone.utc)
    assert booking.end_time == datetime(2025, 1, 3, 12, 0, tzinfo=timezone.utc)
    assert booking.status == "booked"
