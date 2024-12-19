import pytest
from backend.src.app import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.json == {
        "message": "Welcome to the Timeslot Scheduling Tool"}
