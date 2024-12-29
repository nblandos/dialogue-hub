from datetime import datetime


class Booking:
    def __init__(self, id, user_id, date, start_time, end_time,
                 status="booked"):
        self.id = id
        self.user_id = user_id
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
        self.status = status  # booked, cancelled, finished
        self.created_at = datetime.now()

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
            id=data.get("id"),
            user_id=data.get("user_id"),
            date=datetime.fromisoformat(data.get("date")),
            start_time=datetime.fromisoformat(data.get("start_time")),
            end_time=datetime.fromisoformat(data.get("end_time")),
            status=data.get("status", "pending")
        )
