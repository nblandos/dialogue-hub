from flask import Blueprint, request, jsonify
from src.services.booking_service import BookingService

booking_bp = Blueprint('booking', __name__)
booking_service = BookingService()


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
        booking = booking_service.create_booking(data)
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
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': str(e)
        }), 500
