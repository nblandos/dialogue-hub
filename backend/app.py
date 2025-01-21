from flask import Flask, jsonify
from flask_cors import CORS
from src.config.config import Config
from src.database import db, migrate
from src.routes.booking_routes import booking_bp
import os


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(booking_bp)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('SENDER_EMAIL')
    app.config['MAIL_PASSWORD'] = os.getenv('SENDER_PASSWORD')

    @app.route("/")
    def home():
        return jsonify({"message": "Welcome to the Timeslot Scheduling Tool"})

    return app


app = create_app()


def init_db():
    with app.app_context():
        db.create_all()


if __name__ == "__main__":
    init_db()
    app.run(debug=True, host='0.0.0.0')
