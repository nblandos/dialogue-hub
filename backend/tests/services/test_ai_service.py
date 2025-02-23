import pytest
from unittest.mock import Mock, patch
from src.services.ai_service import AIService
import json


@pytest.fixture
def mock_app():
    app = Mock()
    app.config = {
        'KEY_VAULT_NAME': 'test-vault',
        'OPENAI_API_SECRET_NAME': 'test-secret',
        'DEPLOYMENT_NAME': 'test-deployment',
        'OPENAI_ENDPOINT_URL': 'https://test.openai.azure.com',
        'API_URL': 'http://localhost:5000'
    }
    return app


@pytest.fixture
def mock_azure_clients():
    with patch('src.services.ai_service.DefaultAzureCredential') as mock_credential, \
            patch('src.services.ai_service.SecretClient') as mock_secret_client, \
            patch('src.services.ai_service.AzureOpenAI') as mock_openai:
        mock_secret_client.return_value.get_secret.return_value.value = 'test-key'
        yield mock_credential, mock_secret_client, mock_openai


def test_init_app(mock_app, mock_azure_clients):
    _, mock_secret_client, mock_openai = mock_azure_clients
    service = AIService()
    service.init_app(mock_app)
    assert service.deployment == 'test-deployment'
    assert service.client is not None
    mock_secret_client.return_value.get_secret.assert_called_once_with(
        'test-secret')
    mock_openai.assert_called_once()


def test_get_ai_response_not_initialized():
    service = AIService()
    with pytest.raises(RuntimeError, match="AIService is not initialized"):
        service.get_ai_response("test message")


def test_get_ai_response_success(mock_app, mock_azure_clients):
    service = AIService(mock_app)
    mock_thread = Mock(id="thread-123")
    service.client.beta.threads.create.return_value = mock_thread
    mock_run = Mock(status="completed")
    service.client.beta.threads.runs.create.return_value = mock_run
    mock_messages = Mock()
    mock_messages.data = [
        Mock(content=[Mock(text=Mock(value="Test response"))])]
    service.client.beta.threads.messages.list.return_value = mock_messages
    response = service.get_ai_response("test message")
    assert response == "Test response"


def test_get_ai_response_with_existing_thread(mock_app, mock_azure_clients):
    service = AIService(mock_app)
    user_id = "test_user"
    mock_thread = Mock(id="thread-123")
    service.active_threads[user_id] = mock_thread

    mock_run = Mock(status="completed")
    service.client.beta.threads.runs.create.return_value = mock_run
    mock_messages = Mock()
    mock_messages.data = [
        Mock(content=[Mock(text=Mock(value="Test response"))])]
    service.client.beta.threads.messages.list.return_value = mock_messages

    response = service.get_ai_response("test message", user_id=user_id)
    assert response == "Test response"
    service.client.beta.threads.create.assert_not_called()


def test_get_ai_response_run_failed(mock_app, mock_azure_clients):
    service = AIService(mock_app)
    mock_thread = Mock(id="thread-123")
    service.client.beta.threads.create.return_value = mock_thread

    mock_run = Mock(status="failed", last_error="Test error message")
    service.client.beta.threads.runs.create.return_value = mock_run
    service.client.beta.threads.runs.retrieve.return_value = mock_run

    with pytest.raises(RuntimeError, match="Assistant run failed with status: failed"):
        service.get_ai_response("test message")


def test_get_ai_response_unexpected_status(mock_app, mock_azure_clients):
    service = AIService(mock_app)
    mock_thread = Mock(id="thread-123")
    service.client.beta.threads.create.return_value = mock_thread

    mock_run = Mock(status="unexpected_status")
    service.client.beta.threads.runs.create.return_value = mock_run
    service.client.beta.threads.runs.retrieve.return_value = mock_run

    with pytest.raises(RuntimeError, match="Assistant run failed with status: unexpected_status"):
        service.get_ai_response("test message")
