import pytest
from datetime import datetime, timezone
from src.app import db
from src.models.user import User
from src.models.booking import Booking


@pytest.fixture
def test_user(app):
    user = User(
        full_name='Test User',
        email='test@example.com'
    )
    db.session.add(user)
    db.session.commit()
    return user


def test_create_user(app):
    user = User(
        full_name='New User',
        email='new@example.com'
    )
    db.session.add(user)
    db.session.commit()

    assert user.id is not None
    assert user.full_name == 'New User'
    assert user.email == 'new@example.com'
    assert user.created_at is not None
    assert len(user.bookings) == 0


def test_to_dict(test_user):
    data = test_user.to_dict()
    assert data['id'] == test_user.id
    assert data['full_name'] == test_user.full_name
    assert data['email'] == test_user.email
    assert 'created_at' in data
    assert isinstance(data['bookings'], list)


def test_from_dict():
    data = {
        'full_name': 'Dict User',
        'email': 'dict@example.com'
    }
    user = User.from_dict(data)
    assert user.full_name == 'Dict User'
    assert user.email == 'dict@example.com'


def test_user_with_bookings(test_user):
    booking = Booking(
        user_id=test_user.id,
        date=datetime.now(timezone.utc).date(),
        start_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc)
    )
    db.session.add(booking)
    db.session.commit()

    assert len(test_user.bookings) == 1
    assert test_user.bookings[0].id == booking.id


def test_unique_email_constraint(test_user):
    with pytest.raises(Exception):
        duplicate_user = User(
            full_name='Duplicate User',
            email=test_user.email
        )
        db.session.add(duplicate_user)
        db.session.commit()


def test_required_fields():
    with pytest.raises(Exception):
        user = User(email='missing@example.com')
        db.session.add(user)
        db.session.commit()

    with pytest.raises(Exception):
        user = User(full_name='Missing Email')
        db.session.add(user)
        db.session.commit()
