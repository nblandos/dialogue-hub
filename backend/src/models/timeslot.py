from datetime import datetime
from src.app import db


class Timeslot(db.Model):
    __tablename__ = 'timeslots'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey(
        'bookings.id'), nullable=False)

    # time slots are 1 hour long so we only need to store the start time
    # date is also part of start_time
    start_time = db.Column(db.DateTime, nullable=False)

    # count no. of bookings for each time slot so that we can show availability
    booking_count = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Timeslot {self.id} {self.start_time}>'

    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "date": self.date.isoformat(),
            "start_time": self.start_time.isoformat(),
            "booking_count": self.booking_count
        }

    @staticmethod
    def from_dict(data):
        start_time = datetime.fromisoformat(data.get("start_time"))
        return Timeslot(
            booking_id=data.get("booking_id"),
            date=start_time.date(),
            start_time=start_time,
            booking_count=data.get("booking_count", 0)
        )
