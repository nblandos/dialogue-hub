from datetime import datetime
from src.app import db


class Timeslot(db.Model):
    __tablename__ = 'timeslots'

    id = db.Column(db.Integer, primary_key=True)

    # time slots are 1 hour long so we only need to store the start time
    # date is also part of start_time
    start_time = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Timeslot {self.id} {self.start_time}>'

    def to_dict(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat(),
        }

    def booking_count(self):
        return len(self.bookings)

    @staticmethod
    def from_dict(data):
        start_time = datetime.fromisoformat(data.get("start_time"))
        return Timeslot(
            start_time=start_time,
        )
