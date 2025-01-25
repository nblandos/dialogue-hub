from flask import Blueprint, request, jsonify
from src.services.booking_service import BookingService
from src.services.email_service import EmailService

booking_bp = Blueprint('booking', __name__)
booking_service = BookingService()
email_service = EmailService()


@booking_bp.route('/create-booking', methods=['POST'])
def create_booking():
    data = request.get_json()

    """ data in format:
    {
        "user": {
            "email": "Email",
            "full_name": "Full Name"
        },
        "timeslots": [
            {
                "start_time": "YYYY-MM-DDTHH:MM:SS+00:00"
            },
            {
                "start_time": "YYYY-MM-DDTHH:MM:SS+00:00"
            }
        ]
    }
    """

    if not data:
        return jsonify({
            'status': 'error',
            'code': 'INVALID_REQUEST',
            'message': 'Missing request body'
        }), 400

    try:
        booking = booking_service.create_booking(data)

        try:
            email_service.send_confirmation(
                email=booking.user.email,
                booking_date=booking.date,
                booking_time=booking.time_range
            )
        except Exception as e:
            return jsonify({
                'status': 'error',
                'code': 'EMAIL_ERROR',
                'message': str(e)
            }), 500

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
