import pytest
from unittest.mock import patch
from datetime import datetime, timezone, timedelta


@pytest.fixture
def valid_booking_data():
    future_time = datetime.now(timezone.utc) + timedelta(hours=24)
    return {
        'user': {
            'email': 'test@example.com',
            'full_name': 'Test User'
        },
        'timeslots': [
            {'start_time': future_time.isoformat()},
            {'start_time': (future_time + timedelta(hours=1)).isoformat()}
        ]
    }


def test_create_booking_success(client, valid_booking_data):
    future_time = datetime.now(timezone.utc) + timedelta(days=1)
    future_time = future_time.replace(
        hour=10, minute=0, second=0, microsecond=0)

    valid_booking_data['timeslots'] = [
        {'start_time': future_time.isoformat()},
        {'start_time': (future_time + timedelta(hours=1)).isoformat()}
    ]

    with patch('src.routes.booking_routes.email_service.send_confirmation', return_value=True):
        response = client.post(
            '/api/bookings/create-booking',
            json=valid_booking_data,
            headers={'Content-Type': 'application/json'}
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['status'] == 'success'
        assert 'data' in data


def test_create_booking_server_error(client, valid_booking_data):
    with patch(
        'src.routes.booking_routes.booking_service.create_booking'
    ) as mock_create:
        mock_create.side_effect = Exception('Server error')

        response = client.post(
            '/api/bookings/create-booking',
            json=valid_booking_data,
            headers={'Content-Type': 'application/json'}
        )

        assert response.status_code == 500
        data = response.get_json()
        assert data['status'] == 'error'
        assert data['code'] == 'SERVER_ERROR'


def test_create_booking_invalid_data(client):
    invalid_data = {
        'user': {
            'email': 'invalid-email',
            'full_name': ''
        },
        'timeslots': []
    }

    response = client.post(
        '/api/bookings/create-booking',
        json=invalid_data,
        headers={'Content-Type': 'application/json'}
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data['status'] == 'error'
    assert data['code'] == 'INVALID_DATA'


def test_create_booking_email_failure(client, valid_booking_data):
    future_time = datetime.now(timezone.utc) + timedelta(days=1)
    future_time = future_time.replace(
        hour=10, minute=0, second=0, microsecond=0)

    valid_booking_data['timeslots'] = [
        {'start_time': future_time.isoformat()},
        {'start_time': (future_time + timedelta(hours=1)).isoformat()}
    ]

    with patch('src.routes.booking_routes.email_service.send_confirmation',
               side_effect=Exception('Email service failed')):
        response = client.post(
            '/api/bookings/create-booking',
            json=valid_booking_data,
            headers={'Content-Type': 'application/json'}
        )

        assert response.status_code == 500
        data = response.get_json()
        assert data['status'] == 'error'
        assert data['code'] == 'EMAIL_ERROR'


def test_create_booking_missing_body(client):
    response = client.post(
        '/api/bookings/create-booking',
        json={},  # empty body
        headers={'Content-Type': 'application/json'}
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data['status'] == 'error'
    assert data['code'] == 'INVALID_REQUEST'
    assert data['message'] == 'Missing request body'
