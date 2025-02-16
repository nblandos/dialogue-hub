#!/bin/sh
# Run database migrations before starting the app
flask db upgrade
# Start the Flask app
exec flask run --host=0.0.0.0 --port=5001