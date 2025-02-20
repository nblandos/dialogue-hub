import os
from flask import Flask, jsonify
from flask_cors import CORS
from src.config.config import Config
from src import db, migrate, mail, ai_service
from src.routes.booking_routes import booking_bp
from src.routes.timeslot_routes import timeslot_bp
from src.routes.ai_routes import ai_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, origins=[os.getenv('FRONTEND_URL'), 'http://localhost:3000'])
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    ai_service.init_app(app)

    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(timeslot_bp, url_prefix='/api/timeslots')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    @app.route("/")
    def home():
        return jsonify({"message": "Welcome to the Timeslot Scheduling Tool"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run()
