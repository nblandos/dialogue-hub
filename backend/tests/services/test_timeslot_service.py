import pytest
from datetime import datetime, timezone, timedelta
from src.services.timeslot_service import TimeslotService
from src.models.user import User
from src.models.booking import Booking, BookingStatus
from src.models.timeslot import Timeslot
from src import db


@pytest.fixture
def timeslot_service():
    return TimeslotService()


@pytest.fixture
def user(app):
    user = User(email="test@example.com", full_name="Test User")
    db.session.add(user)
    db.session.commit()
    return user


def test_get_or_create_timeslot_creates_new_timeslot(app, timeslot_service):
    start_time = datetime.now(timezone.utc).replace(microsecond=0)
    timeslot = timeslot_service.get_or_create_timeslot(start_time)

    assert timeslot.start_time == start_time
    assert Timeslot.query.count() == 1


def test_get_or_create_timeslot_retrieves_existing_timeslot(
    app, timeslot_service
):
    start_time = datetime.now(timezone.utc).replace(microsecond=0)
    existing = Timeslot(start_time=start_time)
    db.session.add(existing)
    db.session.commit()

    timeslot = timeslot_service.get_or_create_timeslot(start_time)

    assert timeslot.id == existing.id
    assert Timeslot.query.count() == 1


def test_get_start_times_valid_format(app, timeslot_service):
    time_str = "2024-02-01T10:00:00+00:00"
    timeslots = [{"start_time": time_str}]

    result = timeslot_service.get_start_times(timeslots)

    assert len(result) == 1
    assert result[0] == datetime.fromisoformat(time_str)


def test_get_start_times_invalid_format(app, timeslot_service):
    timeslots = [{"start_time": "invalid"}]

    with pytest.raises(ValueError, match="Invalid timeslot format"):
        timeslot_service.get_start_times(timeslots)


def test_check_timeslots_valid_empty_list(app, timeslot_service, user):
    with pytest.raises(ValueError, match="No timeslots provided"):
        timeslot_service.check_timeslots_valid(user, [])


def test_check_timeslots_valid_duplicates(app, timeslot_service, user):
    now = datetime.now(timezone.utc)
    future = now + timedelta(hours=1)
    timeslots = [
        {"start_time": future.isoformat()},
        {"start_time": future.isoformat()}
    ]

    with pytest.raises(ValueError, match="Duplicate timeslots provided"):
        timeslot_service.check_timeslots_valid(user, timeslots)


def test_check_timeslots_valid_past_time(app, timeslot_service, user):
    past = datetime.now(timezone.utc) - timedelta(hours=1)
    timeslots = [{"start_time": past.isoformat()}]

    with pytest.raises(ValueError, match="Cannot book timeslots in the past"):
        timeslot_service.check_timeslots_valid(user, timeslots)


def test_check_timeslots_valid_non_consecutive(app, timeslot_service, user):
    future = datetime.now(timezone.utc) + timedelta(days=1)
    future_plus_2 = future + timedelta(hours=2)
    timeslots = [
        {"start_time": future.isoformat()},
        {"start_time": future_plus_2.isoformat()}
    ]

    with pytest.raises(ValueError, match="Timeslots must be consecutive"):
        timeslot_service.check_timeslots_valid(user, timeslots)


def test_check_timeslots_valid_consecutive(app, timeslot_service, user):
    now = datetime.now(timezone.utc) + timedelta(hours=1)
    next_hour = now + timedelta(hours=1)
    timeslots = [
        {"start_time": now.isoformat()},
        {"start_time": next_hour.isoformat()}
    ]
    print(timeslots)

    # no exception should be raised
    timeslot_service.check_timeslots_valid(user, timeslots)


def test_overlapping_with_active_booking(app, timeslot_service, user):
    start_time = datetime.now(timezone.utc) + timedelta(hours=1)
    timeslot = Timeslot(start_time=start_time)
    booking = Booking(user=user)
    booking.timeslots.append(timeslot)
    db.session.add_all([timeslot, booking])
    db.session.commit()

    new_timeslots = [{"start_time": start_time.isoformat()}]

    with pytest.raises(
        ValueError,
        match="User already has a booking during selected time slots"
    ):
        timeslot_service.check_timeslots_valid(user, new_timeslots)


def test_overlapping_with_cancelled_booking(app, timeslot_service, user):
    # create cancelled booking
    start_time = datetime.now(timezone.utc) + timedelta(hours=1)
    timeslot = Timeslot(start_time=start_time)
    booking = Booking(user=user, status=BookingStatus.CANCELLED)
    booking.timeslots.append(timeslot)
    db.session.add_all([timeslot, booking])
    db.session.commit()

    # should allow rebooking on the same timeslot
    new_timeslots = [{"start_time": start_time.isoformat()}]

    # no exception should be raised
    timeslot_service.check_timeslots_valid(user, new_timeslots)


def test_has_overlapping_timeslots_multiple_bookings(
    app, timeslot_service, user
):
    # create two bookings
    start_time1 = datetime.now(timezone.utc) + timedelta(hours=1)
    start_time2 = datetime.now(timezone.utc) + timedelta(hours=2)

    # make one booking have status BOOKED
    timeslot1 = Timeslot(start_time=start_time1)
    booking1 = Booking(user=user)
    booking1.timeslots.append(timeslot1)

    # make one booking have status CANCELLED
    timeslot2 = Timeslot(start_time=start_time2)
    booking2 = Booking(user=user, status=BookingStatus.CANCELLED)
    booking2.timeslots.append(timeslot2)

    db.session.add_all([timeslot1, timeslot2, booking1, booking2])
    db.session.commit()

    # try overlapping booking with active booking - should raise exception
    assert timeslot_service._has_overlapping_timeslots(
        user, [start_time1]) is True
    # try overlapping booking with cancelled booking -
    # should not raise exception
    assert timeslot_service._has_overlapping_timeslots(
        user, [start_time2]) is False
