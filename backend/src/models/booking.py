from datetime import datetime, timezone
from enum import Enum
from src.app import db


class BookingStatus(Enum):
    BOOKED = 'booked'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey(
        'users.email'), nullable=False)
    status = db.Column(db.Enum(BookingStatus), default=BookingStatus.BOOKED)
    created_at = db.Column(
        db.DateTime, defaulst=lambda: datetime.now(timezone.utc))

    # booking has a list of one or more timeslots
    # (consecutive hours for the same day)
    timeslots = db.relationship(
        'Timeslot', backref='booking', lazy=True, cascade='all, delete-orphan')

    @property
    def date(self):
        """Get date from first timeslot"""
        if self.timeslots:
            return self.timeslots[0].start_time.date()
        return None

    def __repr__(self):
        return f'<Booking {self.id} {self.status.value}>'

    def cancel(self):
        self.status = BookingStatus.CANCELLED

    def complete(self):
        self.status = BookingStatus.COMPLETED

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "timeslots": [timeslot.to_dict() for timeslot in self.timeslots]
        }

    @staticmethod
    def from_dict(data):
        return Booking(
            user_id=data.get("user_id"),
            status=BookingStatus(data.get("status", "booked"))
        )
