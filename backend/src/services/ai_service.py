from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from openai import AzureOpenAI
from flask import current_app as app
import time
import json
import requests


class AIService:
    def __init__(self, app=None):
        self.client = None
        self.deployment = None
        self.assistant = None
        self.active_threads = {}
        self.assistant_id = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        # Azure Key Vault configuration
        key_vault_name = app.config['KEY_VAULT_NAME']
        key_vault_uri = f"https://{key_vault_name}.vault.azure.net"

        # Set up Key Vault client
        credential = DefaultAzureCredential()
        secret_client = SecretClient(
            vault_url=key_vault_uri, credential=credential)

        # Retrieve the API key from Key Vault
        api_key_secret = secret_client.get_secret(
            app.config['OPENAI_API_SECRET_NAME'])
        subscription_key = api_key_secret.value

        # Set deployment name
        self.deployment = app.config['DEPLOYMENT_NAME']

        # Initialize Azure OpenAI client
        self.client = AzureOpenAI(
            azure_endpoint=app.config['OPENAI_ENDPOINT_URL'],
            api_key=subscription_key,
            api_version="2024-05-01-preview",
        )

        self.assistant_id = app.config.get('AZURE_ASSISTANT_ID')

        if self.assistant_id:
            try:
                self.assistant = self.client.beta.assistants.retrieve(
                    assistant_id=self.assistant_id
                )
                self.assistant = self._update_assistant(self.assistant)
            except Exception:
                self.assistant = self._create_assistant()
                app.config['AZURE_ASSISTANT_ID'] = self.assistant.id
        else:
            self.assistant = self._create_assistant()
            app.config['AZURE_ASSISTANT_ID'] = self.assistant.id

    def _get_instructions(self):
        """Return the assistant instructions with current date"""
        current_date = time.strftime("%A, %B %d, %Y")
        return (
            f"You are an AI Assistant called D-Bot for Dialogue Hub's British Sign Language Cafe. "
            f"Today's date is {current_date}. "
            "Help users with information about the Cafe, BSL queries, accessibility needs, "
            "and booking assistance. Create bookings when users request them.\n"
            "Opening Hours:\n"
            "- Monday to Thursday: 8:00 AM - 5:00 PM (08:00-17:00)\n"
            "- Friday: 8:00 AM - 1:00 PM (08:00-13:00)\n"
            "- Weekend: Closed\n"
            "When helping with bookings:\n"
            "- Only accept bookings during opening hours\n"
            "- Reject and explain if requested time is outside opening hours\n"
            "- Collect all required information: full name, email, and desired time\n"
            "- Always require the date before creating a booking\n"
            "- For bookings longer than 1 hour, create multiple consecutive hourly timeslots\n"
            "- For example, if a user requests 1-3pm, create two timeslots: 1-2pm and 2-3pm, but these should still be part of the same booking\n"
            "- Format dates and times in ISO format (YYYY-MM-DDTHH:MM:SS+00:00)\n"
            "- Don't ask users to format times, you should format it yourself\n"
            "- Once you have all valid information, ALWAYS ask the user to confirm the details and THEN attempt to create the booking\n"
            "- Keep track of information provided across messages\n"
            "- If a booking fails, explain why and help fix the issue\n"
            "- Confirm successful bookings with a summary\n"
            "- Keep track of information provided across messages\n"
        )

    def _get_booking_function(self):
        """Return the booking function configuration"""
        return {
            "type": "function",
            "function": {
                "name": "create_booking",
                "description": "Create a booking for the BSL cafe",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "description": "User's email address"
                                },
                                "full_name": {
                                    "type": "string",
                                    "description": "User's full name"
                                }
                            },
                            "required": ["email", "full_name"]
                        },
                        "timeslots": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "start_time": {
                                        "type": "string",
                                        "description": "Start time in ISO format (YYYY-MM-DDTHH:MM:SS+00:00)"
                                    }
                                },
                                "required": ["start_time"]
                            }
                        }
                    },
                    "required": ["user", "timeslots"]
                }
            }
        }

    def _update_assistant(self, assistant):
        """Update existing assistant with current configuration"""
        return self.client.beta.assistants.update(
            assistant_id=assistant.id,
            name="D-Bot",
            model=self.deployment,
            instructions=self._get_instructions(),
            tools=[self._get_booking_function()],
            tool_resources={},
            temperature=0.7,
            top_p=1
        )

    def _create_assistant(self):
        """Create a new assistant"""
        return self.client.beta.assistants.create(
            name="D-Bot",
            model=self.deployment,
            instructions=self._get_instructions(),
            tools=[self._get_booking_function()],
            tool_resources={},
            temperature=0.7,
            top_p=1
        )

    def get_ai_response(self, user_message, user_id=None):
        """Get response using Azure OpenAI Assistant"""
        if not self.client or not self.assistant:
            raise RuntimeError("AIService is not initialized")

        # Use existing thread or create new one
        thread = None
        if user_id and user_id in self.active_threads:
            thread = self.active_threads[user_id]
        else:
            thread = self.client.beta.threads.create()
            if user_id:
                self.active_threads[user_id] = thread

        # Add the user's message to the thread
        self.client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_message
        )

        # Run the assistant
        run = self.client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=self.assistant.id
        )

        # Wait for the response
        while run.status in ['queued', 'in_progress']:
            time.sleep(1)
            run = self.client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )

        if run.status == 'requires_action':
            # Handle function calls
            tool_calls = run.required_action.submit_tool_outputs.tool_calls
            tool_outputs = []

            for tool_call in tool_calls:
                if tool_call.function.name == "create_booking":
                    try:
                        # Parse the function arguments
                        booking_args = json.loads(tool_call.function.arguments)

                        # Make the API call to the booking route
                        response = requests.post(
                            f'{app.config["API_URL"]}/api/bookings/create-booking',
                            json=booking_args,
                            headers={'Content-Type': 'application/json'},
                            timeout=10
                        )

                        if response.status_code == 201:
                            result = response.json()
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "success",
                                    "message": "Booking created successfully",
                                    "data": result.get('data', {})
                                })
                            })
                        else:
                            error_data = response.json()
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "message": error_data.get('message', 'Booking failed'),
                                    "code": error_data.get('code', 'UNKNOWN_ERROR')
                                })
                            })
                    except Exception as e:
                        tool_outputs.append({
                            "tool_call_id": tool_call.id,
                            "output": json.dumps({
                                "status": "error",
                                "message": str(e)
                            })
                        })

            if not tool_outputs:
                raise RuntimeError(
                    "No tool outputs generated for function calls")

            run = self.client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )

            # Wait for final response
            while run.status in ['queued', 'in_progress']:
                time.sleep(1)
                run = self.client.beta.threads.runs.retrieve(
                    thread_id=thread.id,
                    run_id=run.id
                )
                if run.status == 'failed':
                    raise RuntimeError(f"Run failed: {run.last_error}")

        if run.status == 'completed':
            messages = self.client.beta.threads.messages.list(
                thread_id=thread.id
            )
            return messages.data[0].content[0].text.value
        else:
            error_msg = f"Assistant run failed with status: {run.status}"
            if hasattr(run, 'last_error'):
                error_msg += f" - {run.last_error}"
            raise RuntimeError(error_msg)
