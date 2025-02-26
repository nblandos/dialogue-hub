from src.services.booking_service import BookingService
from src.services.email_service import EmailService

booking_service = BookingService()
email_service = EmailService()


def create_booking_internal(data):
    if not data:
        raise ValueError("Missing booking data")

    try:
        booking = booking_service.create_booking(data)

        try:
            email_service.send_confirmation(
                email=booking.user.email,
                booking_date=booking.date,
                booking_time=booking.time_range
            )
        except Exception as e:
            raise Exception(f"Error sending confirmation email: {str(e)}")
        return booking

    except ValueError as e:
        raise ValueError(str(e))
    except Exception as e:
        raise Exception(f"Error creating booking: {str(e)}")
