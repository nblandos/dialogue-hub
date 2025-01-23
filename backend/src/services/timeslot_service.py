from datetime import datetime, timedelta, timezone
from src.models.timeslot import Timeslot
from src.models.booking import BookingStatus
from src import db


class TimeslotService:
    def get_or_create_timeslot(self, start_time):
        """get or create timeslot with given start time"""
        timeslot = Timeslot.query.filter_by(start_time=start_time).first()
        if not timeslot:
            timeslot = Timeslot(start_time=start_time)
            db.session.add(timeslot)
            db.session.flush()
        return timeslot

    def get_start_times(self, timeslots):
        """get the list of timeslots in datetime format"""
        try:
            start_times = [
                datetime.fromisoformat(
                    ts['start_time']).astimezone(timezone.utc)
                for ts in timeslots
            ]
            return start_times
        except (KeyError, ValueError):
            raise ValueError("Invalid timeslot format")

    def check_timeslots_valid(self, user, timeslots):
        """check if timeslots are valid"""
        if not timeslots:
            raise ValueError("No timeslots provided")

        start_times = self.get_start_times(timeslots)
        unique_times = set(start_times)

        # check for duplicate timeslots
        if len(start_times) != len(unique_times):
            raise ValueError('Duplicate timeslots provided')

        # check for past timeslots
        now = datetime.now(timezone.utc)
        if any(start_time < now for start_time in start_times):
            raise ValueError("Cannot book timeslots in the past")

        # check for overlapping timeslots
        if self._has_overlapping_timeslots(user, start_times):
            raise ValueError(
                'User already has a booking during selected time slots')

        # check for timeslots consecutive
        for i in range(1, len(start_times)):
            if start_times[i] - start_times[i-1] != timedelta(hours=1):
                raise ValueError('Timeslots must be consecutive')

    def _has_overlapping_timeslots(self, user, new_times):
        """check if user has overlapping timeslots"""
        new_timestamps = {t.timestamp() for t in new_times}

        for booking in user.bookings:
            if booking.status in [
                BookingStatus.CANCELLED, BookingStatus.COMPLETED
            ]:
                continue

            existing_timestamps = {ts.start_time.timestamp()
                                   for ts in booking.timeslots}
            if new_timestamps.intersection(existing_timestamps):
                return True
        return False
