from datetime import datetime, timezone
from enum import Enum
from src.database import db

# many-to-many relationship between bookings and timeslots
booking_timeslot = db.Table(
    'booking_timeslot',
    db.Column('booking_id', db.Integer, db.ForeignKey(
        'bookings.id'), primary_key=True),
    db.Column('timeslot_id', db.Integer, db.ForeignKey(
        'timeslots.id'), primary_key=True)
)


class BookingStatus(Enum):
    BOOKED = 'booked'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    status = db.Column(db.Enum(BookingStatus), nullable=False,
                       default=BookingStatus.BOOKED)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    # booking has a list of one or more (consecutive) timeslots
    # (many to many relationship)
    timeslots = db.relationship(
        'Timeslot', secondary=booking_timeslot, backref='bookings')

    @property
    def date(self):
        """extract date from first timeslot"""
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
