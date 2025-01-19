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

        # example for when email service is implemented,
        # this is done on successful booking creation
        # try:
        #     email_service.send_booking_confirmation(
        #         email=booking.user.email,
        #         name=booking.user.full_name,
        #         booking_id=booking.id,
        #         timeslots=booking.timeslots
        #     )
        # except Exception as email_error:
        # log error and continue (consider logging library)

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
