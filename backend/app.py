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


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
