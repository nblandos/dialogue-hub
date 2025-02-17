import pytest
from unittest.mock import Mock, patch
from src.services.ai_service import AIService


@pytest.fixture
def mock_app():
    app = Mock()
    app.config = {
        'KEY_VAULT_NAME': 'test-vault',
        'OPENAI_API_SECRET_NAME': 'test-secret',
        'DEPLOYMENT_NAME': 'test-deployment',
        'OPENAI_ENDPOINT_URL': 'https://test.openai.azure.com'
    }
    return app


@pytest.fixture
def mock_azure_clients():
    with patch('src.services.ai_service.DefaultAzureCredential') as mock_credential, \
            patch('src.services.ai_service.SecretClient') as mock_secret_client, \
            patch('src.services.ai_service.AzureOpenAI') as mock_openai:

        mock_secret_client.return_value.get_secret.return_value.value = \
            'test-key'
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

    mock_choice = Mock()
    mock_choice.message.content = "Test response"
    mock_completion = Mock()
    mock_completion.choices = [mock_choice]
    service.client.chat.completions.create.return_value = mock_completion

    response = service.get_ai_response("test message")

    assert response == "Test response"
    service.client.chat.completions.create.assert_called_once()
