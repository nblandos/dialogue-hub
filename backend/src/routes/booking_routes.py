from flask import Blueprint, request, jsonify
from src.database import db
from src.models.booking import Booking
from src.models.timeslot import Timeslot
from src.models.user import User
from datetime import datetime, timedelta, timezone

booking_bp = Blueprint('booking', __name__)


def get_timeslot_start_times(timeslots):
    start_times = [datetime.fromisoformat(ts['start_time'])
                   .astimezone(timezone.utc)
                   for ts in timeslots]
    start_times.sort()
    return start_times


def has_overlapping_timeslots(user, new_timeslots):
    new_start_times = get_timeslot_start_times(new_timeslots)
    existing_bookings = user.bookings

    for booking in existing_bookings:
        for timeslot in booking.timeslots:
            if timeslot.start_time in new_start_times:
                return True
    return False


def check_timeslots_valid(user, timeslots):
    start_times = get_timeslot_start_times(timeslots)
    unique_times = set(start_times)

    # check for duplicate timeslots
    if len(start_times) != len(unique_times):
        raise ValueError('Duplicate timeslots provided')

    # check for past timeslots
    now = datetime.now(timezone.utc)
    for start_time in start_times:
        if start_time < now:
            raise ValueError('Cannot book past timeslots')

    # check for overlapping timeslots
    if has_overlapping_timeslots(user, timeslots):
        raise ValueError(
            'User already has a booking during selected time slots')

    # check for timeslots on the same day and consecutive
    first_day = start_times[0].date()
    if not all(start_time.date() == first_day for start_time in start_times):
        raise ValueError('Timeslots must be on the same day')

    for i in range(1, len(start_times)):
        if start_times[i] - start_times[i - 1] != timedelta(hours=1):
            raise ValueError('Timeslots must be consecutive')


def validate_and_get_user(user_data):
    if not isinstance(user_data, dict):
        raise ValueError('User data must be an object')

    # Get existing user or create new one using model validation
    user = User.query.filter_by(
        email=user_data.get('email', '').strip()).first()
    if not user:
        user = User.from_dict(user_data)  # User model handles validation
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

        # add timeslots to booking
        for timeslot_data in data['timeslots']:
            start_time = datetime.fromisoformat(
                timeslot_data['start_time']).astimezone(timezone.utc)

            timeslot = Timeslot.query.filter_by(start_time=start_time).first()
            if not timeslot:
                timeslot = Timeslot(start_time=start_time)
                db.session.add(timeslot)
            booking.timeslots.append(timeslot)

        db.session.add(booking)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'data': booking.to_dict()
        }), 201

    except ValueError as e:
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
