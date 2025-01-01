from datetime import datetime, timezone
from src.app import db


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='booked')
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat(),
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return Booking(
            user_id=data.get("user_id"),
            date=datetime.fromisoformat(data.get("date")).date(),
            start_time=datetime.fromisoformat(data.get("start_time")),
            end_time=datetime.fromisoformat(data.get("end_time")),
            status=data.get("status", "booked")
        )
