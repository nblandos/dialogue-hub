from flask import current_app
from flask_mail import Message
from ics import Calendar, Event
from datetime import datetime, timedelta
"""
Add the following to the requirements.txt file:
Flask
Flask-Mail
ics
"""


def send_confirmation(email, booking_date, booking_time):
    location = "Dialogue Café, London"

    # Parse date and time to create datetime objects
    start_time = datetime.strptime(
        f"{booking_date} {booking_time}", "%Y-%m-%d %H:%M")
    end_time = start_time + timedelta(hours=1)

    # Format times for calendar URLs
    start_str = start_time.strftime("%Y%m%dT%H%M%S")
    end_str = end_time.strftime("%Y%m%dT%H%M%S")

    # Generate .ics file
    c = Calendar()
    e = Event()
    e.name = "Café Booking Confirmation"
    e.begin = start_time
    e.end = end_time
    e.location = location
    e.description = "Your booking at Dialogue Café is confirmed!"
    e.organizer = f"mailto:{current_app.config['MAIL_USERNAME']}"
    e.attendees = [f"mailto:{email}"]

    c.events.add(e)

    # Add METHOD:REQUEST to the .ics content
    ics_content = str(c).replace("\n", "\r\n")
    ics_content = f"BEGIN:VCALENDAR\r\nMETHOD:REQUEST\r\n{ics_content[13:]}"

    # Create Email
    msg = Message('Café Booking Confirmation',
                  sender=current_app.config['MAIL_USERNAME'],
                  recipients=[email])

    msg.body = f"""
    Your booking is confirmed:
    - Date: {booking_date}
    - Time: {booking_time}
    - Location: {location}

    Add to your calendar:
    - Google Calendar: https://www.google.com/calendar/render?action=TEMPLATE&text=Café+Booking+Confirmation&dates={start_str}Z/{end_str}Z&details=Your+booking+at+Dialogue+Café+is+confirmed!&location={location.replace(' ', '+')}
    - Apple Calendar: See attached .ics file
    - Outlook Calendar: https://outlook.live.com/calendar/0/deeplink/compose?subject=Café+Booking+Confirmation&startdt={start_time.isoformat()}&enddt={end_time.isoformat()}&location={location.replace(' ', '+')}&body=Your+booking+at+Dialogue+Café+is+confirmed!
    """

    msg.attach("booking.ics",
               "text/calendar; charset=UTF-8; method=REQUEST",
               ics_content)

    # METHOD:REQUEST in .ics file: Defines the purpose of the calendar event within the file itself.
    # method=REQUEST in MIME type: Tells the email client how to process the .ics file as part of the email.

    # Get mail instance from current_app
    mail = current_app.extensions.get('mail')
    if not mail:
        raise RuntimeError("Mail extension not initialized")

    mail.send(msg)

    return True
    # return jsonify({"message": "Confirmation email sent!"}), 200
