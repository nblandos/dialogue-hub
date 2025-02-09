from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from .services.ai_service import AIService

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
ai_service = AIService()
