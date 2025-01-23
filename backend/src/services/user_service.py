from src.models.user import User
from src import db


class UserService:
    @staticmethod
    def get_or_create_user(user_data):
        """get or create user from user data (lookup by email)"""
        if not isinstance(user_data, dict):
            raise ValueError("Invalid user data format")

        email = user_data.get('email', '').strip()
        full_name = user_data.get('full_name', '').strip()

        if not email:
            raise ValueError("Email is required")
        if not full_name:
            raise ValueError("Full name is required")

        user = User.query.filter_by(email=email).first()
        if user:
            if user.full_name != full_name:
                user.full_name = full_name
                db.session.add(user)
        else:
            user = User.from_dict(user_data)
            db.session.add(user)

        return user
