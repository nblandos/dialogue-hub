from datetime import datetime, timezone, timedelta
from src.models.timeslot import Timeslot
from src import db


def test_get_availability_missing_dates(client):
    # No query parameters provided
    response = client.get('/availability')
    data = response.get_json()
    assert response.status_code == 400
    assert data['status'] == 'error'
    assert data['code'] == 'INVALID_REQUEST'
    assert 'Start and end date required' in data['message']


def test_get_availability_invalid_date_format(client):
    # Query parameters not in valid ISO format.
    response = client.get(
        '/availability?start_date=invalid&end_date=2024-01-01T00:00:00+00:00'
    )
    data = response.get_json()
    assert response.status_code == 500
    assert data['status'] == 'error'
    assert data['code'] == 'SERVER_ERROR'
    assert ('Invalid isoformat' in data['message'] or
            'does not match format' in data['message'])


def test_get_availability_success(client, app):
    future_time = (datetime.now(timezone.utc) +
                   timedelta(days=1)).replace(tzinfo=None)
    timeslot = Timeslot(start_time=future_time)
    db.session.add(timeslot)
    db.session.commit()

    start_date = (future_time - timedelta(hours=1)).isoformat()
    end_date = (future_time + timedelta(hours=1)).isoformat()
    response = client.get(
        f'/availability?start_date={start_date}&end_date={end_date}'
    )
    data = response.get_json()
    assert response.status_code == 200
    assert data['status'] == 'success'
    key = timeslot.start_time.isoformat()
    assert key in data['data']
    assert data['data'][key] == timeslot.booking_count
