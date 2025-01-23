from datetime import datetime, timezone
from enum import Enum
from src import db

# many-to-many relationship between bookings and timeslots
booking_timeslot = db.Table(
    'booking_timeslot',
    db.Column('booking_id', db.Integer, db.ForeignKey(
        'bookings.id', ondelete='CASCADE'), primary_key=True),
    db.Column('timeslot_id', db.Integer, db.ForeignKey(
        'timeslots.id', ondelete='CASCADE'), primary_key=True),
    db.Index('idx_booking_timeslot', 'booking_id', 'timeslot_id')
)


class BookingStatus(Enum):
    BOOKED = 'booked'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)

    status = db.Column(db.Enum(BookingStatus), nullable=False,
                       default=BookingStatus.BOOKED)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    # booking has a list of one or more (consecutive) timeslots
    # (many to many relationship)
    timeslots = db.relationship(
        'Timeslot',
        secondary=booking_timeslot,
        backref=db.backref('bookings', lazy='dynamic'),
        order_by="Timeslot.start_time"
    )

    @property
    def date(self):
        """extract date from first timeslot"""
        return self.timeslots[0].start_time.date() if self.timeslots else None

    @property
    def time_range(self):
        """get time from start of first timeslot to end of last timeslot"""
        if not self.timeslots:
            return None
        start = self.timeslots[0].start_time
        end = self.timeslots[-1].end_time
        return {
            'start': start.strftime('%H:%M'),
            'end': end.strftime('%H:%M')
        }

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
        if 'user_id' not in data:
            raise ValueError("User ID is required")

        try:
            status = BookingStatus(data.get("status", "booked"))
        except ValueError:
            raise ValueError("Invalid booking status")

        return Booking(
            user_id=data["user_id"],
            status=status
        )
