from flask import current_app
from flask_mail import Message
from ics import Calendar, Event
from datetime import datetime
import logging


class EmailService:
    LOCATION = (
        "Royal Docks Center for Sustainability, University of East London "
        "Docklands Campus, 4-6 University Way, London E16 2RD"
    )
    ORGANIZER_NAME = "Dialogue Cafe"

    def __init__(self):
        self.mail = None

    def _get_mail(self):
        """get mail instance from current app context"""
        if not self.mail:
            self.mail = current_app.extensions.get('mail')
            if not self.mail:
                raise RuntimeError("Mail extension not initialized")
        return self.mail

    def _create_calendar_event(self, email, start_time, end_time):
        """generate .ics file"""
        c = Calendar()
        e = Event()
        e.name = "Dialogue Cafe Booking"
        e.begin = start_time
        e.end = end_time
        e.location = self.LOCATION
        e.description = "Your booking at Dialogue Cafe is confirmed!"

        organizer_email = current_app.config['MAIL_USERNAME']
        e.organizer = f"{self.ORGANIZER_NAME};mailto:{organizer_email}"
        e.attendees = [f"mailto:{email}"]

        c.events.add(e)
        return c

    def _format_calendar_content(self, calendar):
        """format calendar content with METHOD:REQUEST"""
        ics_content = calendar.serialize().replace("\n", "\r\n")
        return f"BEGIN:VCALENDAR\r\nMETHOD:REQUEST\r\n{ics_content[13:]}"

    def _create_email_body(self, booking_date, booking_time,
                           start_time, end_time):
        """create email message with calendar links"""
        start_str = start_time.strftime("%Y%m%dT%H%M%S")
        end_str = end_time.strftime("%Y%m%dT%H%M%S")
        location_encoded = self.LOCATION.replace(' ', '+')

        return f"""
        Your booking at Dialogue Cafe is confirmed:
        - Date: {booking_date}
        - Time: {booking_time['start']} - {booking_time['end']}
        - Location: {self.LOCATION}

        Add to your calendar:
        - Google Calendar: https://www.google.com/calendar/render?action=TEMPLATE&text=Café+Booking+Confirmation&dates={start_str}Z/{end_str}Z&details=Your+booking+at+Dialogue+Café+is+confirmed!&location={location_encoded}
        - Outlook Calendar: https://outlook.live.com/calendar/0/deeplink/compose?subject=Café+Booking+Confirmation&startdt={start_time.isoformat()}&enddt={end_time.isoformat()}&location={location_encoded}&body=Your+booking+at+Dialogue+Café+is+confirmed!
        - Apple Calendar: See attached .ics file
        """

    def send_confirmation(self, email, booking_date, booking_time):
        """send booking confirmation email"""
        try:
            if not all([email, booking_date, booking_time]):
                raise ValueError("Missing required parameters")

            # parse date and time
            start_time = datetime.strptime(
                f"{booking_date} {booking_time['start']}", "%Y-%m-%d %H:%M")
            end_time = datetime.strptime(
                f"{booking_date} {booking_time['end']}", "%Y-%m-%d %H:%M")

            # create calendar event
            calendar = self._create_calendar_event(email, start_time, end_time)
            ics_content = self._format_calendar_content(calendar)

            # create email message
            msg = Message(
                'Dialogue Cafe Booking Confirmation',
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[email]
            )

            msg.body = self._create_email_body(
                booking_date, booking_time, start_time, end_time
            )

            # attach calendar invitation
            msg.attach(
                "booking.ics",
                "text/calendar; charset=UTF-8; method=REQUEST",
                ics_content
            )

            # send email
            self._get_mail().send(msg)
            return True

        except Exception as e:
            raise RuntimeError(f"Email service error: {str(e)}")
