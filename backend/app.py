from flask import Flask, jsonify
from flask_cors import CORS
from src.config.config import Config
from src import db, migrate, mail
from src.routes.booking_routes import booking_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    app.register_blueprint(booking_bp)

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
