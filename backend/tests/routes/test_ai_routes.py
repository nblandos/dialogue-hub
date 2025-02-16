from unittest.mock import patch


def test_chat_success(client):
    with patch(
        'src.routes.ai_routes.ai_service.get_ai_response'
    ) as mock_response:
        mock_response.return_value = "Hello! How can I help you?"

        response = client.post('/chat', json={
            'message': 'Hi there'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['response'] == "Hello! How can I help you?"
        mock_response.assert_called_once_with('Hi there')


def test_chat_missing_message(client):
    response = client.post('/chat', json={})

    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'No message provided'


def test_chat_service_error(client):
    with patch(
        'src.routes.ai_routes.ai_service.get_ai_response'
    ) as mock_response:
        mock_response.side_effect = Exception('AI service error')

        response = client.post('/chat', json={
            'message': 'Hi there'
        })

        assert response.status_code == 500
        data = response.get_json()
        assert data['success'] is False
        assert data['error'] == 'AI service error'


def test_chat_invalid_request(client):
    response = client.post('/chat', data='invalid json')

    assert response.status_code == 500
    data = response.get_json()
    assert data['success'] is False
    assert 'error' in data
