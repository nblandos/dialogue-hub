from datetime import datetime, timezone
from src import db


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
        return f'<User {self.id} {self.email}>'

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
        email = data.get("email", "").strip()
        full_name = data.get("full_name", "").strip()

        if not email:
            raise ValueError("Email is required")
        if not full_name:
            raise ValueError("Full name is required")
        if len(full_name) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(full_name) > 100:
            raise ValueError("Full name must be less than 100 characters")
        if '@' not in email:
            raise ValueError("Invalid email format")

        return User(email=email, full_name=full_name)
