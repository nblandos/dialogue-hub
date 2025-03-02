from src.services.email_service import EmailService
from src.services.booking_service import BookingService
from flask import Blueprint, request, jsonify

booking_bp = Blueprint('booking', __name__)
booking_service = BookingService()
email_service = EmailService()


def create_booking_internal(data):
    if not data:
        raise ValueError("Missing booking data")

    # Create the booking
    booking = booking_service.create_booking(data)

    # Send confirmation email
    email_service.send_confirmation(
        email=booking.user.email,
        booking_date=booking.date,
        booking_time=booking.time_range
    )

    return booking


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
