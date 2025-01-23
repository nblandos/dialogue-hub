from datetime import datetime, timezone, timedelta
from src.database import db


class Timeslot(db.Model):
    __tablename__ = 'timeslots'

    id = db.Column(db.Integer, primary_key=True)

    # time slots are 1 hour long so we only need to store the start time
    # date is also part of start_time
    start_time = db.Column(db.DateTime(timezone=True),
                           nullable=False, unique=True)

    @property
    def booking_count(self):
        return self.bookings.count()

    @property
    def end_time(self):
        """calculate end time as 1 hour after start time"""
        return self.start_time + timedelta(hours=1)

    def __repr__(self):
        return f'<Timeslot {self.id} {self.start_time}>'

    def to_dict(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat()
        }

    @staticmethod
    def from_dict(data):
        if 'start_time' not in data:
            raise ValueError("Start time is required")

        try:
            start_time = datetime.fromisoformat(
                data['start_time']).astimezone(timezone.utc)
        except ValueError:
            raise ValueError("Invalid datetime format")

        return Timeslot(start_time=start_time)
