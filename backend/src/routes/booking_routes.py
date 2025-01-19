from flask import Blueprint, request, jsonify
from src.database import db
from src.models.booking import Booking
from src.models.timeslot import Timeslot
from src.models.user import User
from datetime import datetime

booking_bp = Blueprint('booking', __name__)


@booking_bp.route('/create-booking', methods=['POST'])
def create_booking():
    data = request.get_json()

    if not data or not data.get('user') or not data.get('timeslots'):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # create user or get existing by email
        user_data = data['user']
        user = User.query.filter_by(email=user_data['email']).first()
        if not user:
            user = User.from_dict(user_data)
            db.session.add(user)

        # create booking
        booking = Booking(user=user)

        # add timeslots to booking
        for timeslot_data in data['timeslots']:
            start_time = datetime.fromisoformat(timeslot_data['start_time'])
            timeslot = Timeslot.query.filter_by(start_time=start_time).first()
            if not timeslot:
                timeslot = Timeslot(start_time=start_time)
                db.session.add(timeslot)
            booking.timeslots.append(timeslot)

        db.session.add(booking)
        db.session.commit()

        return jsonify(booking.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
