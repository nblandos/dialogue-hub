import pytest
from datetime import datetime, timezone
from unittest.mock import Mock, patch
from src.services.email_service import EmailService


@pytest.fixture
def email_service():
    return EmailService()


@pytest.fixture
def valid_booking_data():
    return {
        'email': 'test@example.com',
        'booking_date': '2024-01-20',
        'booking_time': {
            'start': '10:00',
            'end': '11:00'
        }
    }


def test_get_mail_initialization(app, email_service):
    with app.app_context():
        assert email_service.mail is None
        mail = email_service._get_mail()
        assert mail is not None


def test_send_confirmation_success(app, email_service, valid_booking_data):
    with app.app_context():
        mock_mail = Mock()
        with patch.object(email_service, '_get_mail', return_value=mock_mail):
            result = email_service.send_confirmation(
                valid_booking_data['email'],
                valid_booking_data['booking_date'],
                valid_booking_data['booking_time']
            )
            assert result is True
            mock_mail.send.assert_called_once()


def test_send_confirmation_missing_parameters(app, email_service):
    with app.app_context():
        with pytest.raises(ValueError, match="Missing required parameters"):
            email_service.send_confirmation(None, None, None)


def test_create_calendar_event(app, email_service, valid_booking_data):
    with app.app_context():
        start_time = datetime.strptime(
            f"{valid_booking_data['booking_date']} "
            f"{valid_booking_data['booking_time']['start']}",
            "%Y-%m-%d %H:%M"
        ).replace(tzinfo=timezone.utc)
        end_time = datetime.strptime(
            f"{valid_booking_data['booking_date']} "
            f"{valid_booking_data['booking_time']['end']}",
            "%Y-%m-%d %H:%M"
        ).replace(tzinfo=timezone.utc)

        calendar = email_service._create_calendar_event(
            valid_booking_data['email'],
            start_time,
            end_time
        )
        event = list(calendar.events)[0]
        assert event.name == "Dialogue Cafe Booking"
        assert event.begin.datetime == start_time
        assert event.end.datetime == end_time


def test_mail_not_initialized(app, email_service):
    with app.app_context():
        # remove mail extension from app context
        app.extensions.pop('mail', None)
        with pytest.raises(
            RuntimeError, match="Mail extension not initialized"
        ):
            email_service._get_mail()


def test_send_confirmation_non_value_error(
    app, email_service, valid_booking_data
):
    with app.app_context():
        with patch.object(
            email_service, '_get_mail', side_effect=Exception("Some error")
        ):
            with pytest.raises(
                RuntimeError, match="Email service error: Some error"
            ):
                email_service.send_confirmation(
                    valid_booking_data['email'],
                    valid_booking_data['booking_date'],
                    valid_booking_data['booking_time']
                )
