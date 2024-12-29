from datetime import datetime


class User:
    def __init__(self, id, full_name, email):
        self.id = id
        self.full_name = full_name
        self.email = email
        self.bookings = []
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "bookings": [booking.to_dict() for booking in self.bookings]
        }

    @staticmethod
    def from_dict(data):
        return User(
            id=data.get("id"),
            full_name=data.get("full_name"),
            email=data.get("email")
        )
