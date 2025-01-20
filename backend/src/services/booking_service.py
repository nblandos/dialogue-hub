from datetime import datetime, timezone
from src.models.booking import Booking
from src.services.user_service import UserService
from src.services.timeslot_service import TimeslotService
from src.database import db


class BookingService:
    def __init__(self):
        self.user_service = UserService()
        self.timeslot_service = TimeslotService()

    def create_booking(self, booking_data):
        """create booking with given data"""
        if not booking_data.get('user'):
            raise ValueError("User information is required")
        if not booking_data.get('timeslots'):
            raise ValueError("Timeslot selection is required")

        try:
            user = self.user_service.get_or_create_user(booking_data['user'])
            self.timeslot_service.check_timeslots_valid(
                user, booking_data['timeslots'])

            booking = Booking(user=user)
            db.session.add(booking)

            for timeslot_data in booking_data['timeslots']:
                start_time = datetime.fromisoformat(
                    timeslot_data['start_time']).astimezone(timezone.utc)

                timeslot = self.timeslot_service.get_or_create_timeslot(
                    start_time)
                booking.timeslots.append(timeslot)

            db.session.commit()
            return booking

        except Exception:
            db.session.rollback()
            raise
