from flask import Blueprint, request, jsonify
from src.controllers.booking_controller import create_booking_internal

booking_bp = Blueprint('booking', __name__)


@booking_bp.route('/create-booking', methods=['POST'])
def create_booking():
    data = request.get_json()

    if not data:
        return jsonify({
            'status': 'error',
            'code': 'INVALID_REQUEST',
            'message': 'Missing request body'
        }), 400

    try:
        booking = create_booking_internal(data)

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
        error_code = 'EMAIL_ERROR' if 'confirmation email' in str(
            e) else 'SERVER_ERROR'
        return jsonify({
            'status': 'error',
            'code': error_code,
            'message': str(e)
        }), 500
