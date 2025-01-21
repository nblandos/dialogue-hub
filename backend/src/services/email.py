from flask import Flask, jsonify
from flask_mail import Mail, Message
from ics import Calendar, Event
"""
Add the following to the requirements.txt file:
Flask
Flask-Mail
ics
"""


# Configure Flask-Mail

app = Flask(__name__)

mail = Mail(app)


def send_confirmation(email, booking_date, booking_time):
    # data = request.json
    # email = data['email']
    # booking_date = data['date']
    # booking_time = data['time']
    location = "Dialogue Café, London"

    # Generate .ics file
    c = Calendar()
    e = Event()
    e.name = "Café Booking Confirmation"
    e.begin = f"{booking_date} {booking_time}"
    e.duration = {"hours": 1}
    e.location = location

    # Add the following lines to make the email an invitation:
    # Add a description for the event.
    e.description = "Your booking at Dialogue Café is confirmed!"
    # Set the organizer's email address.
    e.organizer = "mailto:nblandos@gmail.com"
    e.attendees = [f"mailto:{email}"]  # Specify the attendee's email address.

    c.events.add(e)

    # Add METHOD:REQUEST to the .ics content to mark it as an invitation.
    ics_content = str(c).replace("\n", "\r\n")  # Ensure CRLF line endings.
    # Add METHOD:REQUEST.
    ics_content = f"BEGIN:VCALENDAR\r\nMETHOD:REQUEST\r\n{ics_content[13:]}"

    with open("booking.ics", "w") as f:
        # Write the modified .ics content with METHOD:REQUEST.
        f.write(ics_content)

    # Create Email
    msg = Message('Café Booking Confirmation',
                  sender='nblandos@gmail.com',
                  recipients=[email])
    msg.body = f"""
    Your booking is confirmed:
    - Date: {booking_date}
    - Time: {booking_time}
    - Location: {location}

    Add to your calendar:
    - Google Calendar: https://www.google.com/calendar/render?action=TEMPLATE&text=Café+Booking+Confirmation&dates={booking_date}T{booking_time.replace(':', '')}Z/{booking_date}T{booking_time.replace(':', '')}Z&details=Your+booking+at+Dialogue+Café+is+confirmed!&location={location.replace(' ', '+')}
    - Apple Calendar: See attached .ics file
    - Outlook Calendar: https://outlook.live.com/calendar/0/deeplink/compose?subject=Café+Booking+Confirmation&startdt={booking_date}T{booking_time}:00&enddt={booking_date}T{booking_time}:00&location={location.replace(" ", "+")}&body=Your+booking+at+Dialogue+Café+is+confirmed!
    """

    # Attach the .ics file with the appropriate MIME type to ensure it's treated as an invitation.
    msg.attach("booking.ics",
               "text/calendar; charset=UTF-8; method=REQUEST", ics_content)

    # METHOD:REQUEST in .ics file: Defines the purpose of the calendar event within the file itself.
    # method=REQUEST in MIME type: Tells the email client how to process the .ics file as part of the email.

    mail.send(msg)

    return jsonify({"message": "Confirmation email sent!"}), 200
