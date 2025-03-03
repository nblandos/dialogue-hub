import pytest
import json
from unittest.mock import MagicMock, patch, PropertyMock

from src.services.ai_service import AIService


@pytest.fixture
def mock_openai():
    """Mock the Azure OpenAI client and its methods"""
    with patch('src.services.ai_service.AzureOpenAI') as mock:
        mock_client = MagicMock()
        mock.return_value = mock_client

        mock_client.beta = MagicMock()
        mock_client.beta.assistants = MagicMock()
        mock_client.beta.threads = MagicMock()
        mock_client.beta.threads.messages = MagicMock()
        mock_client.beta.threads.runs = MagicMock()

        yield mock_client


@pytest.fixture
def mock_app():
    """Create a mock Flask app with required config"""
    app = MagicMock()
    app.config = {
        'KEY_VAULT_NAME': 'test-vault',
        'OPENAI_API_SECRET_NAME': 'openai-key',
        'DEPLOYMENT_NAME': 'test-deployment',
        'OPENAI_ENDPOINT_URL': 'https://test-endpoint.openai.azure.com',
        'AZURE_ASSISTANT_ID': None
    }
    return app


@pytest.fixture
def mock_secret_client():
    """Mock Azure Key Vault secret client"""
    with patch('src.services.ai_service.DefaultAzureCredential'):
        with patch('src.services.ai_service.SecretClient') as mock_client:
            mock_secret = MagicMock()
            mock_secret.value = "test-api-key"
            mock_client.return_value.get_secret.return_value = mock_secret
            yield mock_client


def test_init_app(mock_app, mock_secret_client, mock_openai):
    """Test initialization of the AIService with an app"""
    mock_assistant = MagicMock()
    mock_assistant.id = "new-assistant-id"
    mock_openai.beta.assistants.create.return_value = mock_assistant

    service = AIService()
    service.init_app(mock_app)

    assert service.client is not None
    assert service.deployment == "test-deployment"
    assert service.assistant == mock_assistant
    assert mock_app.config['AZURE_ASSISTANT_ID'] == "new-assistant-id"


def test_init_app_existing_assistant(mock_app, mock_secret_client, mock_openai):
    """Test initialization with existing assistant ID"""
    mock_app.config['AZURE_ASSISTANT_ID'] = "existing-assistant-id"
    mock_assistant = MagicMock()
    mock_assistant.id = "existing-assistant-id"
    mock_openai.beta.assistants.retrieve.return_value = mock_assistant
    mock_openai.beta.assistants.update.return_value = mock_assistant

    service = AIService()
    service.init_app(mock_app)

    mock_openai.beta.assistants.retrieve.assert_called_once_with(
        assistant_id="existing-assistant-id"
    )
    mock_openai.beta.assistants.update.assert_called_once()
    assert service.assistant == mock_assistant


def test_get_ai_response_not_initialized():
    """Test error when service is not initialized"""
    service = AIService()
    with pytest.raises(RuntimeError, match="AIService is not initialized"):
        service.get_ai_response("Hello")


def test_get_ai_response_success(mock_openai):
    """Test successful response generation"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_mock

    content_mock = MagicMock()
    content_mock.text.value = "Hello, I'm D-Bot"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Hello")

    assert response == "Hello, I'm D-Bot"
    mock_openai.beta.threads.create.assert_called_once()
    mock_openai.beta.threads.messages.create.assert_called_once()
    mock_openai.beta.threads.runs.create.assert_called_once()


def test_get_ai_response_with_existing_thread(mock_openai):
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    existing_thread = MagicMock(id="existing-thread")
    service.active_threads = {"user123": existing_thread}

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_mock

    content_mock = MagicMock()
    content_mock.text.value = "Hello again"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Hello again", user_id="user123")

    mock_openai.beta.threads.create.assert_not_called()
    mock_openai.beta.threads.messages.create.assert_called_once_with(
        thread_id="existing-thread",
        role="user",
        content="Hello again"
    )
    assert response == "Hello again"


def test_get_ai_response_run_failed(mock_openai):
    """Test handling of failed runs"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="failed")
    run_mock.last_error = "Assistant error"
    mock_openai.beta.threads.runs.create.return_value = run_mock

    with pytest.raises(RuntimeError, match="Assistant run failed with status: failed"):
        service.get_ai_response("Hello")


@patch('time.time')
@patch('time.sleep')
def test_get_ai_response_timeout(mock_sleep, mock_time, mock_openai):
    """Test timeout handling"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    # Mock time to trigger timeout
    # Start time and check time (over 30 sec timeout)
    mock_time.side_effect = [0, 31]

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="queued")
    mock_openai.beta.threads.runs.create.return_value = run_mock

    with pytest.raises(RuntimeError, match="Timeout waiting for assistant response"):
        service.get_ai_response("Hello")


@patch('src.routes.booking_routes.create_booking_internal')
def test_get_ai_response_with_booking_function(mock_create_booking, mock_openai):
    """Test function calling for booking creation"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "create_booking"
    tool_call.function.arguments = json.dumps({
        "user": {"email": "test@example.com", "full_name": "Test User"},
        "timeslots": [{"start_time": "2023-06-01T10:00:00+00:00"}]
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]

    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    booking_mock = MagicMock()
    booking_mock.to_dict.return_value = {
        "id": "booking-1",
        "user": {"email": "test@example.com"},
        "timeslots": [{"start_time": "2023-06-01T10:00:00+00:00"}]
    }
    mock_create_booking.return_value = booking_mock

    content_mock = MagicMock()
    content_mock.text.value = "Booking confirmed!"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Book a slot")

    mock_create_booking.assert_called_once()
    mock_openai.beta.threads.runs.submit_tool_outputs.assert_called_once()
    assert response == "Booking confirmed!"


@patch('src.routes.timeslot_routes.get_availability_internal')
def test_get_ai_response_with_availability_function(mock_get_availability, mock_openai):
    """Test function calling for availability check"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_availability"
    tool_call.function.arguments = json.dumps({
        "start_date": "2023-06-01T09:00:00+00:00",
        "end_date": "2023-06-01T17:00:00+00:00"
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]

    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_get_availability.return_value = {
        "2023-06-01T10:00:00+00:00": 1,
        "2023-06-01T11:00:00+00:00": 0
    }

    content_mock = MagicMock()
    content_mock.text.value = "Available times: 10AM (1 booking), 11AM (0 bookings)"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Check availability")

    mock_get_availability.assert_called_once()
    assert response == "Available times: 10AM (1 booking), 11AM (0 bookings)"


@patch('src.data.videos.get_videos_by_category')
def test_get_ai_response_with_videos_function(mock_get_videos, mock_openai):
    """Test function calling for video retrieval"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_videos"
    tool_call.function.arguments = json.dumps({
        "category": "menu",
        "query": "coffee"
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]

    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_get_videos.return_value = ["Latte", "Espresso"]

    content_mock = MagicMock()
    content_mock.text.value = "Here are some coffee videos: [VIDEO:menu:Latte] [VIDEO:menu:Espresso]"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Show me coffee videos")

    mock_get_videos.assert_called_once_with("menu")
    assert response == "Here are some coffee videos: [VIDEO:menu:Latte] [VIDEO:menu:Espresso]"


def test_init_with_app():
    """Test initialization directly with app argument (line 18)"""
    with patch('src.services.ai_service.AIService.init_app') as mock_init_app:
        app = MagicMock()
        service = AIService(app)
        mock_init_app.assert_called_once_with(app)


def test_init_app_retrieve_failure(mock_app, mock_secret_client, mock_openai):
    """Test handling when assistant retrieval fails (lines 53-55)"""
    mock_app.config['AZURE_ASSISTANT_ID'] = "invalid-id"
    mock_openai.beta.assistants.retrieve.side_effect = Exception("Not found")

    new_assistant = MagicMock()
    new_assistant.id = "new-assistant-id"
    mock_openai.beta.assistants.create.return_value = new_assistant

    service = AIService()
    service.init_app(mock_app)

    mock_openai.beta.assistants.retrieve.assert_called_once()
    mock_openai.beta.assistants.create.assert_called_once()
    assert mock_app.config['AZURE_ASSISTANT_ID'] == "new-assistant-id"


def test_booking_invalid_json(mock_openai):
    """Test handling of invalid JSON in booking function (lines 257-258)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "create_booking"
    tool_call.function.arguments = "{invalid json"

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]

    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    content_mock = MagicMock()
    content_mock.text.value = "I couldn't process your booking"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Book a slot")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    assert "Failed to process booking request" in json.loads(
        tool_outputs[0]["output"])["message"]
    assert response == "I couldn't process your booking"


@patch('src.routes.timeslot_routes.get_availability_internal')
def test_availability_value_error(mock_get_availability, mock_openai):
    """Test ValueErrors in availability function (lines 286-305)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_availability"
    tool_call.function.arguments = json.dumps({
        "start_date": "2023-06-01T09:00:00+00:00",
        "end_date": "2023-06-01T17:00:00+00:00"
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_get_availability.side_effect = ValueError("Invalid date format")

    content_mock = MagicMock()
    content_mock.text.value = "I couldn't check availability"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Check availability")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert output["status"] == "error"
    assert output["code"] == "INVALID_DATA"
    assert output["message"] == "Invalid date format"


@patch('src.data.videos.get_videos_by_category')
def test_videos_with_query_filter(mock_get_videos, mock_openai):
    """Test video function with query filter (lines 320, 404)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_videos"
    tool_call.function.arguments = json.dumps({
        "category": "menu",
        "query": "Coffee"  # should be case-insensitive
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_get_videos.return_value = [
        "Coffee Latte", "Espresso", "Tea", "Iced Coffee"]

    content_mock = MagicMock()
    content_mock.text.value = "Coffee videos"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Show coffee videos")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert len(output["data"]) == 2
    assert "Coffee Latte" in output["data"]
    assert "Iced Coffee" in output["data"]
    assert "Tea" not in output["data"]


@patch('src.data.videos.get_videos_by_category')
def test_videos_value_error(mock_get_videos, mock_openai):
    """Test ValueError in videos function (lines 335-345)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_videos"
    tool_call.function.arguments = json.dumps({
        "category": "invalid-category"  # Not 'menu' or 'training'
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_get_videos.side_effect = ValueError("Invalid category")

    content_mock = MagicMock()
    content_mock.text.value = "I couldn't find those videos"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Show me videos")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert output["status"] == "error"
    assert output["code"] == "INVALID_DATA"
    assert output["message"] == "Invalid category"


def test_no_tool_outputs_generated(mock_openai):
    """Test when no tool outputs are generated (line 354->267)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "unsupported_function"
    tool_call.function.arguments = "{}"

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]

    mock_openai.beta.threads.runs.create.return_value = run_action

    with pytest.raises(RuntimeError, match="No tool outputs generated for function calls"):
        service.get_ai_response("Do something")


def test_run_failed_with_last_error(mock_openai):
    """Test run failed with last_error attribute (lines 364->368)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="failed")
    run_mock.last_error = "Connection timeout"
    mock_openai.beta.threads.runs.create.return_value = run_mock

    with pytest.raises(RuntimeError, match="Assistant run failed with status: failed - Connection timeout"):
        service.get_ai_response("Hello")


@patch('src.routes.booking_routes.create_booking_internal')
def test_booking_value_error(mock_create_booking, mock_openai):
    """Test ValueError in booking function (lines 375-385)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "create_booking"
    tool_call.function.arguments = json.dumps({
        "user": {"email": "invalid", "full_name": "Test User"},
        "timeslots": [{"start_time": "2023-06-01T10:00:00+00:00"}]
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_create_booking.side_effect = ValueError("Invalid email format")

    content_mock = MagicMock()
    content_mock.text.value = "Booking failed"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Book a slot")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert output["status"] == "error"
    assert output["code"] == "INVALID_DATA"
    assert output["message"] == "Invalid email format"


def test_availability_missing_parameters(mock_openai):
    """Test missing parameters in availability function (line 395)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_availability"
    tool_call.function.arguments = json.dumps({
        "start_date": "2023-06-01T09:00:00+00:00"
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    content_mock = MagicMock()
    content_mock.text.value = "I need more information"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Check availability")

    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert output["status"] == "error"
    assert output["code"] == "INVALID_DATA"
    assert "Missing required" in output["message"]


@patch('time.sleep')
def test_run_state_transition(mock_sleep, mock_openai):
    """Test retrieval and status transition of a run"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="test-thread")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_in_progress = MagicMock()
    type(run_in_progress).status = PropertyMock(return_value="in_progress")
    run_in_progress.id = "run-id"

    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")
    run_completed.id = "run-id"

    mock_openai.beta.threads.runs.create.return_value = run_in_progress
    mock_openai.beta.threads.runs.retrieve.return_value = run_completed

    content_mock = MagicMock()
    content_mock.text.value = "Processing complete"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Hello")

    mock_openai.beta.threads.runs.retrieve.assert_called_once_with(
        thread_id="test-thread",
        run_id="run-id"
    )
    mock_sleep.assert_called_once_with(1)
    assert response == "Processing complete"


def test_booking_generic_exception(mock_openai):
    """Test generic exception handling in booking function (lines 295-296)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "create_booking"
    tool_call.function.arguments = json.dumps({
        "user": {"email": "test@example.com", "full_name": "Test User"},
        "timeslots": [{"start_time": "2023-06-01T10:00:00+00:00"}]
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    with patch('src.routes.booking_routes.create_booking_internal') as mock_create_booking:
        mock_create_booking.side_effect = Exception(
            "Unexpected database error")

        content_mock = MagicMock()
        content_mock.text.value = "Something went wrong with your booking"
        message_mock = MagicMock()
        message_mock.content = [content_mock]
        messages_mock = MagicMock()
        messages_mock.data = [message_mock]
        mock_openai.beta.threads.messages.list.return_value = messages_mock

        response = service.get_ai_response("Book a slot")

        tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
            1]["tool_outputs"]
        output = json.loads(tool_outputs[0]["output"])
        assert output["status"] == "error"
        assert output["code"] == "SERVER_ERROR"
        assert "Unexpected database error" in output["message"]


@patch('src.data.videos.get_videos_by_category')
def test_videos_with_empty_query_filter(mock_get_videos, mock_openai):
    """Test video function with empty query filter (line 404)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_videos"
    tool_call.function.arguments = json.dumps({
        "category": "menu",
        "query": ""  # Empty query
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    mock_videos = ["Coffee", "Tea", "Espresso"]
    mock_get_videos.return_value = mock_videos

    content_mock = MagicMock()
    content_mock.text.value = "Here are all videos"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Show all videos")

    # Verify all videos are returned when query is empty
    tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
        1]["tool_outputs"]
    output = json.loads(tool_outputs[0]["output"])
    assert output["status"] == "success"
    assert len(output["data"]) == 3
    assert set(output["data"]) == set(mock_videos)


def test_get_availability_general_exception(mock_openai):
    """Test generic exception in availability function (lines 408-410)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    tool_call = MagicMock()
    tool_call.id = "tool-call-id"
    tool_call.function.name = "get_availability"
    tool_call.function.arguments = json.dumps({
        "start_date": "2023-06-01T09:00:00+00:00",
        "end_date": "2023-06-01T17:00:00+00:00"
    })

    run_action = MagicMock()
    type(run_action).status = PropertyMock(return_value="requires_action")
    run_action.required_action.submit_tool_outputs.tool_calls = [tool_call]
    run_completed = MagicMock()
    type(run_completed).status = PropertyMock(return_value="completed")

    mock_openai.beta.threads.runs.create.return_value = run_action
    mock_openai.beta.threads.runs.submit_tool_outputs.return_value = run_completed

    with patch('src.routes.timeslot_routes.get_availability_internal') as mock_get_availability:
        mock_get_availability.side_effect = Exception(
            "Database connection error")

        content_mock = MagicMock()
        content_mock.text.value = "I couldn't check availability"
        message_mock = MagicMock()
        message_mock.content = [content_mock]
        messages_mock = MagicMock()
        messages_mock.data = [message_mock]
        mock_openai.beta.threads.messages.list.return_value = messages_mock

        response = service.get_ai_response("Check availability")

        tool_outputs = mock_openai.beta.threads.runs.submit_tool_outputs.call_args[
            1]["tool_outputs"]
        output = json.loads(tool_outputs[0]["output"])
        assert output["status"] == "error"
        assert output["code"] == "SERVER_ERROR"
        assert "Database connection error" in output["message"]


def test_run_with_unexpected_status(mock_openai):
    """Test handling of unexpected run status (else: break case)"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_unexpected = MagicMock()
    type(run_unexpected).status = PropertyMock(return_value="cancelled")
    mock_openai.beta.threads.runs.create.return_value = run_unexpected

    content_mock = MagicMock()
    content_mock.text.value = "Response after cancelled run"
    message_mock = MagicMock()
    message_mock.content = [content_mock]
    messages_mock = MagicMock()
    messages_mock.data = [message_mock]
    mock_openai.beta.threads.messages.list.return_value = messages_mock

    response = service.get_ai_response("Hello")

    assert response == "Response after cancelled run"

    mock_openai.beta.threads.runs.retrieve.assert_not_called()


def test_run_failed_without_last_error(mock_openai):
    """Test run failed without last_error attribute"""
    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="failed")
    delattr(run_mock, 'last_error') if hasattr(
        run_mock, 'last_error') else None
    mock_openai.beta.threads.runs.create.return_value = run_mock

    with pytest.raises(RuntimeError, match="^Assistant run failed with status: failed$"):
        service.get_ai_response("Hello")


def test_get_ai_response_stores_thread_in_active_threads(mock_openai):
    from src.services.ai_service import AIService
    from unittest.mock import MagicMock, PropertyMock

    service = AIService()
    service.client = mock_openai
    service.assistant = MagicMock(id="test-assistant")

    user_id = "test_user"
    assert user_id not in service.active_threads

    # Mock thread creation
    thread_mock = MagicMock(id="thread-id")
    mock_openai.beta.threads.create.return_value = thread_mock

    run_mock = MagicMock()
    type(run_mock).status = PropertyMock(return_value="completed")
    mock_openai.beta.threads.runs.create.return_value = run_mock

    service.get_ai_response("Hello, D-Bot!", user_id=user_id)

    assert user_id in service.active_threads
    assert service.active_threads[user_id] is thread_mock
