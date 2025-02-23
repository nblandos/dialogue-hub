import pytest
from datetime import datetime, timezone, timedelta
from src.services.booking_service import BookingService
from src.models.booking import Booking, BookingStatus
from src.models.user import User
from src import db


@pytest.fixture
def booking_service():
    return BookingService()


@pytest.fixture
def booking_data():
    future_time = datetime.now(timezone.utc) + timedelta(hours=24)
    return {
        'user': {
            'email': 'test@example.com',
            'full_name': 'Test User'
        },
        'timeslots': [
            {'start_time': future_time.isoformat()},
            {'start_time': (future_time + timedelta(hours=1)).isoformat()}
        ]
    }


def test_create_booking_success(app, booking_service, booking_data):
    future_time = datetime.now(timezone.utc) + timedelta(days=1)
    future_time = future_time.replace(
        hour=10, minute=0, second=0, microsecond=0)

    booking_data['timeslots'] = [
        {'start_time': future_time.isoformat()},
        {'start_time': (future_time + timedelta(hours=1)).isoformat()}
    ]

    booking = booking_service.create_booking(booking_data)

    assert isinstance(booking, Booking)
    assert booking.user.email == 'test@example.com'
    assert len(booking.timeslots) == 2
    assert booking.status == BookingStatus.BOOKED
    assert Booking.query.count() == 1


def test_create_booking_missing_user(app, booking_service, booking_data):
    invalid_data = {
        'timeslots': booking_data['timeslots']
    }

    with pytest.raises(ValueError, match="User information is required"):
        booking_service.create_booking(invalid_data)


def test_create_booking_missing_timeslots(app, booking_service, booking_data):
    invalid_data = {
        'user': booking_data['user']
    }

    with pytest.raises(ValueError, match="Timeslot selection is required"):
        booking_service.create_booking(invalid_data)


def test_create_booking_with_existing_user(app, booking_service, booking_data):
    future_time = datetime.now(timezone.utc) + timedelta(days=1)
    future_time = future_time.replace(
        hour=10, minute=0, second=0, microsecond=0)

    booking_data['timeslots'] = [
        {'start_time': future_time.isoformat()},
        {'start_time': (future_time + timedelta(hours=1)).isoformat()}
    ]

    existing_user = User(
        email='test@example.com',
        full_name='Existing User'
    )
    db.session.add(existing_user)
    db.session.commit()

    booking = booking_service.create_booking(booking_data)

    assert booking.user.id == existing_user.id
    assert booking.user.full_name == 'Test User'
    assert Booking.query.count() == 1


def test_create_booking_rollback_on_error(app, booking_service, booking_data):
    booking_data['timeslots'][1]['start_time'] = 'invalid-time-format'

    with pytest.raises(ValueError):
        booking_service.create_booking(booking_data)

    assert Booking.query.count() == 0
    assert User.query.count() == 0
