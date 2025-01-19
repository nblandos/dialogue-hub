from flask import Blueprint, request, jsonify
from src.database import db
from src.models.booking import Booking, BookingStatus
from src.models.timeslot import Timeslot
from src.models.user import User
from datetime import datetime, timedelta, timezone

booking_bp = Blueprint('booking', __name__)


def get_timeslot_start_times(timeslots):
    try:
        start_times = [
            datetime.fromisoformat(ts['start_time']).astimezone(timezone.utc)
            for ts in timeslots
        ]
        return start_times
    except (KeyError, ValueError):
        raise ValueError("Invalid timeslot format")


def has_overlapping_timeslots(user, new_timeslots):
    new_start_times = get_timeslot_start_times(new_timeslots)
    new_timestamps = {t.astimezone(timezone.utc).timestamp()
                      for t in new_start_times}

    for booking in user.bookings:
        if (booking.status == BookingStatus.CANCELLED or
                booking.status == BookingStatus.COMPLETED):
            continue

        for timeslot in booking.timeslots:
            booking_time = timeslot.start_time.astimezone(
                timezone.utc).timestamp()
            if booking_time in new_timestamps:
                return True
    return False


def check_timeslots_valid(user, timeslots):
    if not timeslots:
        raise ValueError("No timeslots provided")

    start_times = get_timeslot_start_times(timeslots)
    unique_times = set(start_times)

    # check for duplicate timeslots
    if len(start_times) != len(unique_times):
        raise ValueError('Duplicate timeslots provided')

    # check for past timeslots
    now = datetime.now(timezone.utc)
    if any(start_time < now for start_time in start_times):
        raise ValueError("Cannot book timeslots in the past")

    # check for overlapping timeslots
    if has_overlapping_timeslots(user, timeslots):
        raise ValueError(
            'User already has a booking during selected time slots')

    # check for timeslots on the same day and consecutive
    first_day = start_times[0].date()
    if not all(time.date() == first_day for time in start_times):
        raise ValueError("All timeslots must be on the same day")

    for i in range(1, len(start_times)):
        if start_times[i] - start_times[i-1] != timedelta(hours=1):
            raise ValueError('Timeslots must be consecutive')


def validate_and_get_user(user_data):
    if not isinstance(user_data, dict):
        raise ValueError("Invalid user data format")

    email = user_data.get('email', '').strip()
    if not email:
        raise ValueError("Email is required")

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User.from_dict(user_data)
        db.session.add(user)

    return user


@booking_bp.route('/create-booking', methods=['POST'])
def create_booking():
    data = request.get_json()

    if not data:
        return jsonify({
            'status': 'error',
            'code': 'INVALID_REQUEST',
            'message': 'Missing request body'
        }), 400

    if not data.get('user'):
        return jsonify({
            'status': 'error',
            'code': 'MISSING_USER',
            'message': 'User information is required'
        }), 400

    if not data.get('timeslots'):
        return jsonify({
            'status': 'error',
            'code': 'MISSING_TIMESLOTS',
            'message': 'Timeslot selection is required'
        }), 400

    try:
        # create user or get existing by email
        user = validate_and_get_user(data['user'])
        check_timeslots_valid(user, data['timeslots'])

        # create booking
        booking = Booking(user=user)
        db.session.add(booking)

        # add timeslots to booking
        for timeslot_data in data['timeslots']:
            start_time = datetime.fromisoformat(
                timeslot_data['start_time']).astimezone(timezone.utc)

            timeslot = Timeslot.query.filter_by(start_time=start_time).first()
            if not timeslot:
                timeslot = Timeslot(start_time=start_time)
                db.session.add(timeslot)
                db.session.flush()

            booking.timeslots.append(timeslot)
            db.session.flush()

        db.session.commit()

        return jsonify({
            'status': 'success',
            'data': booking.to_dict()
        }), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'code': 'INVALID_DATA',
            'message': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': str(e)
        }), 500
