from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.timeslot import Timeslot

timeslot_bp = Blueprint('timeslot', __name__)


@timeslot_bp.route('/availability', methods=['GET'])
def get_availability():
    """Get timeslot availabilities for a given range
    Query parameters:
    - start_date: ISO formatted datetime string
    - end_date: ISO formatted datetime string
    """
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        if not start_date or not end_date:
            return jsonify({
                'status': 'error',
                'code': 'INVALID_REQUEST',
                'message': 'Start and end date required'
            }), 400

        timeslots = Timeslot.query.filter(
            Timeslot.start_time >= datetime.fromisoformat(start_date),
            Timeslot.start_time <= datetime.fromisoformat(end_date)
        ).all()

        availability = {
            ts.start_time.isoformat(): ts.booking_count
            for ts in timeslots
        }

        return jsonify({
            'status': 'success',
            'data': availability
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': str(e)
        }), 500
