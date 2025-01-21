import pytest
from flask import json
from app import app, mail  # Import the Flask app and mail instance
from urllib.parse import quote

"""
Add the following to the requirements.txt file:
pytest
"""

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True  # Enable testing mode
    with app.test_client() as client:
        yield client


def test_send_confirmation_email(client):
    """Test the /send-confirmation endpoint."""
    # Test data
    test_data = {
        "email": "test@example.com",
        "date": "2025-01-20",
        "time": "15:00"
    }

    # Intercept emails
    with mail.record_messages() as outbox:
        # Send POST request
        response = client.post('/send-confirmation', 
                                data=json.dumps(test_data), 
                                content_type='application/json')

        # Verify the response
        assert response.status_code == 200
        assert response.json["message"] == "Confirmation email sent!"

        # Verify email was sent
        assert len(outbox) == 1
        email = outbox[0]

        # Validate email contents
        assert email.subject == "Café Booking Confirmation"
        assert email.recipients == [test_data["email"]]
        assert "Your booking is confirmed" in email.body
        assert "Add to your calendar" in email.body

        # Validate .ics attachment
        assert len(email.attachments) == 1
        attachment = email.attachments[0]
        assert attachment.filename == "booking.ics"
        assert "BEGIN:VCALENDAR" in attachment.data.decode()
        assert "METHOD:REQUEST" in attachment.data.decode()

        # Validate calendar links in email body
        google_calendar_link = (
            "https://www.google.com/calendar/render?action=TEMPLATE"
            f"&text={quote('Café Booking Confirmation')}"  # URL-encode the event title
            f"&dates=20250120T150000Z/20250120T160000Z"  # Start and end time in UTC
            f"&details={quote('Your booking at Dialogue Café is confirmed!')}"  # URL-encode the event details
            f"&location={quote('Dialogue Café, London')}"  # URL-encode the location
        )

        assert google_calendar_link in email.body

        outlook_calendar_link = (
            "https://outlook.live.com/calendar/0/deeplink/compose"
            f"?subject={quote('Café Booking Confirmation')}"  # URL-encode the subject
            f"&startdt=2025-01-20T15:00:00Z"  # Start time in UTC
            f"&enddt=2025-01-20T16:00:00Z"  # End time in UTC
            f"&location={quote('Dialogue Café, London')}"  # URL-encode the location
            f"&body={quote('Your booking at Dialogue Café is confirmed!')}"  # URL-encode the body text
        )
        assert outlook_calendar_link in email.body
