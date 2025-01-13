from datetime import datetime, timezone
from src.app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    # one to many relationship with bookings
    bookings = db.relationship(
        'Booking', backref='user', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "created_at": self.created_at.isoformat(),
            "bookings": [booking.to_dict() for booking in self.bookings]
        }

    @staticmethod
    def from_dict(data):
        return User(
            email=data.get("email"),
            full_name=data.get("full_name")
        )
