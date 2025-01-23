import pytest
from datetime import datetime, timezone
from src.models.timeslot import Timeslot
from src.models.booking import Booking, BookingStatus
from src.models.user import User
from src import db


@pytest.fixture
def sample_datetime():
    return datetime(2024, 1, 1, 9, 0, tzinfo=timezone.utc)


@pytest.fixture
def timeslot(sample_datetime):
    return Timeslot(start_time=sample_datetime)


@pytest.fixture
def user():
    return User(email="test@example.com", full_name="Test User")


@pytest.fixture
def booking(user, timeslot):
    booking = Booking(user=user, status=BookingStatus.BOOKED)
    booking.timeslots.append(timeslot)
    return booking


def test_create_timeslot(timeslot, sample_datetime):
    assert timeslot.start_time == sample_datetime
    assert timeslot.bookings.count() == 0


def test_timeslot_to_dict(timeslot, sample_datetime):
    timeslot_dict = timeslot.to_dict()
    assert timeslot_dict["start_time"] == sample_datetime.isoformat()


def test_timeslot_from_dict(sample_datetime):
    data = {"start_time": sample_datetime.isoformat()}
    timeslot = Timeslot.from_dict(data)
    assert timeslot.start_time == sample_datetime


def test_booking_count(app, timeslot, booking):
    db.session.add(timeslot)
    db.session.add(booking)
    db.session.commit()

    assert timeslot.booking_count == 1


def test_multiple_bookings(app, timeslot, user):
    db.session.add(timeslot)
    db.session.add(user)

    booking1 = Booking(user=user, status=BookingStatus.BOOKED)
    booking2 = Booking(user=user, status=BookingStatus.BOOKED)
    booking1.timeslots.append(timeslot)
    booking2.timeslots.append(timeslot)

    db.session.add(booking1)
    db.session.add(booking2)
    db.session.commit()

    assert timeslot.booking_count == 2


def test_timeslot_repr(timeslot):
    assert repr(timeslot) == f'<Timeslot {timeslot.id} {timeslot.start_time}>'


def test_timeslot_uniqueness(app, sample_datetime):
    ts1 = Timeslot(start_time=sample_datetime)
    ts2 = Timeslot(start_time=sample_datetime)

    db.session.add(ts1)
    db.session.commit()

    with pytest.raises(Exception):
        db.session.add(ts2)
        db.session.commit()


def test_timeslot_validation_errors():
    with pytest.raises(ValueError, match="Start time is required"):
        Timeslot.from_dict({})

    with pytest.raises(ValueError, match="Invalid datetime format"):
        Timeslot.from_dict({"start_time": "invalid-date"})
