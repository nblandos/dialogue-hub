import pytest
from datetime import datetime, timezone
from src.models.booking import Booking, BookingStatus
from src.models.timeslot import Timeslot
from src.models.user import User
from src.database import db


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
    booking = Booking(user=user)
    booking.timeslots.append(timeslot)
    return booking


def test_create_booking(app, booking):
    db.session.add(booking)
    db.session.commit()

    assert booking.status == BookingStatus.BOOKED
    assert len(booking.timeslots) == 1
    assert isinstance(booking.created_at, datetime)


def test_booking_status_changes(booking):
    booking.cancel()
    assert booking.status == BookingStatus.CANCELLED

    booking.complete()
    assert booking.status == BookingStatus.COMPLETED


def test_booking_date_property(booking, sample_datetime):
    assert booking.date == sample_datetime.date()

    # test with no timeslots
    empty_booking = Booking(user_id=1)
    assert empty_booking.date is None


def test_booking_to_dict(app, booking, sample_datetime):
    db.session.add(booking)
    db.session.commit()

    booking_dict = booking.to_dict()
    assert booking_dict["status"] == "booked"
    assert booking_dict["date"] == sample_datetime.date().isoformat()
    assert len(booking_dict["timeslots"]) == 1


def test_booking_from_dict():
    data = {
        "user_id": 1,
        "status": "cancelled"
    }
    booking = Booking.from_dict(data)
    assert booking.user_id == 1
    assert booking.status == BookingStatus.CANCELLED


def test_multiple_timeslots(app, booking):
    second_timeslot = Timeslot(
        start_time=datetime(2024, 1, 1, 10, 0, tzinfo=timezone.utc)
    )
    booking.timeslots.append(second_timeslot)

    db.session.add(booking)
    db.session.commit()

    assert len(booking.timeslots) == 2


def test_booking_repr(app, booking):
    db.session.add(booking)
    db.session.commit()

    assert repr(booking) == f'<Booking {booking.id} booked>'


def test_booking_default_values(app, user):
    booking = Booking(user=user)
    db.session.add(booking)
    db.session.commit()

    assert booking.status == BookingStatus.BOOKED
    assert isinstance(booking.created_at, datetime)
    assert booking.timeslots == []
