from src.models.user import User
from src.database import db


class UserService:
    @staticmethod
    def get_or_create_user(user_data):
        """get or create user from user data (lookup by email)"""
        if not isinstance(user_data, dict):
            raise ValueError("Invalid user data format")

        email = user_data.get('email', '').strip()
        if not email:
            raise ValueError("Email is required")

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User.from_dict(user_data)
            db.session.add(user)

        return user
