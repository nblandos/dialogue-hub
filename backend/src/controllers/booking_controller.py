from src.services.booking_service import BookingService
from src.services.email_service import EmailService

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
