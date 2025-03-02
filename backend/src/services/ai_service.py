from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from openai import AzureOpenAI
import time
import json

MAX_BOOKINGS_PER_TIMESLOT = 3


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
            "- Only on Friday: 8:00 AM - 1:00 PM (08:00-13:00)\n"
            "- Weekend: Closed\n"
            "When helping with bookings:\n"
            "- First, always check availability for the requested time period\n"
            f"- Each timeslot has a booking_count value - timeslots with booking_count less than {MAX_BOOKINGS_PER_TIMESLOT} are available\n"
            "- When listing available times, you must show ALL business hours (8am-5pm Mon-Thu, 8am-1pm Fri)\n"
            "- The get_availability function may return only timeslots that already have bookings\n"
            "- For any business hour timeslot NOT returned by the function, assume it's completely available (0 bookings)\n"
            "- When displaying available times, include the current booking count for each slot\n"
            "- Suggest alternative times if requested slots are unavailable\n"
            "- Collect all required information: full name, email, and desired time\n"
            "- Each timeslot is 1 hour long and starts and ends on the hour\n"
            "- Always require the date before creating a booking\n"
            "- For bookings longer than 1 hour, create multiple consecutive hourly timeslots, BUT only create single timeslots for 1 hour bookings\n"
            "- For example, if a user requests 1-3pm, create two timeslots: 1-2pm and 2-3pm, but these should still be part of the same booking\n"
            "- Format dates and times in ISO format (YYYY-MM-DDTHH:MM:SS+00:00) when making a function call\n"
            "- However, when presenting dates to a user they should be in a human-readable format \n"
            "- Only accept bookings during opening hours\n"
            "- Reject and explain if requested time is outside opening hours\n"
            "- Don't ask users to format times, you should format it yourself\n"
            "- Once you have all valid information, ALWAYS ask the user to confirm the details and THEN attempt to create the booking\n"
            "- If a booking fails, explain why and help fix the issue\n"
            "- Confirm successful bookings with a summary\n"
            "- Only provide relevant and necessary information in each message\n"
            "- ALWAYS keep track of information provided across messages\n"
            "About BSL videos:\n"
            "- You can share British Sign Language (BSL) videos from our library\n"
            "- When users ask about menu items or learning BSL, share video links from this format: [VIDEO:item_name]\n"
            "- For menu items, use format: [VIDEO:menu:item_name] (e.g. [VIDEO:menu:Coffee Latte])\n"
            "- For training phrases, use format: [VIDEO:training:phrase_name] (e.g. [VIDEO:training:Good morning])\n"
            "- If a user asks about a menu item, suggest a video of that item\n"
            "- If a user asks about a training phrase, suggest a video of that phrase\n"
            "- If a menu item is unavailable, suggest similar items\n"
            "- Do not suggest more than 5 videos at a time\n"
            "- If a user asks about learning BSL or seeing signs, suggest some videos they might be interested in\n"
            "- The frontend will automatically convert these links to embedded videos\n"
        )

    def _get_tools(self):
        """Return the booking function configuration"""
        return [
            {
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
            },
            {
                "type": "function",
                "function": {
                    "name": "get_availability",
                    "description": "Get timeslot availabilities for a given range",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "start_date": {
                                "type": "string",
                                "description": "Start date in ISO format (YYYY-MM-DDTHH:MM:SS+00:00)"
                            },
                            "end_date": {
                                "type": "string",
                                "description": "End date in ISO format (YYYY-MM-DDTHH:MM:SS+00:00)"
                            }
                        },
                        "required": ["start_date", "end_date"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_videos",
                    "description": "Get BSL video information for menu items or training phrases",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "category": {
                                "type": "string",
                                "enum": ["menu", "training"],
                                "description": "Category of videos (menu or training)"
                            },
                            "query": {
                                "type": "string",
                                "description": "Optional search term to filter videos by name"
                            }
                        },
                        "required": ["category"]
                    }
                }
            }
        ]

    def _update_assistant(self, assistant):
        """Update existing assistant with current configuration"""
        return self.client.beta.assistants.update(
            assistant_id=assistant.id,
            name="D-Bot",
            model=self.deployment,
            instructions=self._get_instructions(),
            tools=self._get_tools(),
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
            tools=self._get_tools(),
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

        timeout_seconds = 30
        start_time = time.time()

        while run.status not in ['completed', 'failed']:

            if time.time() - start_time > timeout_seconds:
                raise RuntimeError("Timeout waiting for assistant response.")

            if run.status in ['queued', 'in_progress', 'cancelling']:
                time.sleep(1)
                run = self.client.beta.threads.runs.retrieve(
                    thread_id=thread.id,
                    run_id=run.id
                )

            elif run.status == 'requires_action':
                tool_calls = run.required_action.submit_tool_outputs.tool_calls
                tool_outputs = []

                for tool_call in tool_calls:
                    if tool_call.function.name == "create_booking":
                        try:
                            booking_args = json.loads(
                                tool_call.function.arguments)

                            try:
                                from src.routes.booking_routes import create_booking_internal

                                booking = create_booking_internal(booking_args)

                                tool_outputs.append({
                                    "tool_call_id": tool_call.id,
                                    "output": json.dumps({
                                        "status": "success",
                                        "message": "Booking created successfully",
                                        "data": booking.to_dict()
                                    })
                                })
                            except ValueError as e:
                                tool_outputs.append({
                                    "tool_call_id": tool_call.id,
                                    "output": json.dumps({
                                        "status": "error",
                                        "message": str(e),
                                        "code": "INVALID_DATA"
                                    })
                                })
                            except Exception as e:
                                tool_outputs.append({
                                    "tool_call_id": tool_call.id,
                                    "output": json.dumps({
                                        "status": "error",
                                        "message": str(e),
                                        "code": "SERVER_ERROR"
                                    })
                                })
                        except Exception as e:
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "message": f"Failed to process booking request: {str(e)}"
                                })
                            })

                    elif tool_call.function.name == "get_availability":
                        try:
                            from src.routes.timeslot_routes import get_availability_internal

                            args = json.loads(tool_call.function.arguments)

                            if not args.get('start_date') or not args.get('end_date'):
                                raise ValueError(
                                    "Missing required start_date or end_date")

                            availability_data = get_availability_internal(
                                args['start_date'],
                                args['end_date']
                            )

                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "success",
                                    "data": availability_data
                                })
                            })
                        except ValueError as e:
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "code": "INVALID_DATA",
                                    "message": str(e)
                                })
                            })
                        except Exception as e:
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "code": "SERVER_ERROR",
                                    "message": str(e)
                                })
                            })

                    elif tool_call.function.name == "get_videos":
                        try:
                            args = json.loads(tool_call.function.arguments)
                            category = args.get('category')
                            query = args.get('query', '').lower()

                            from src.data.videos import get_videos_by_category

                            videos = get_videos_by_category(category)

                            if query:
                                videos = [
                                    v for v in videos if query in v.lower()]

                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "success",
                                    "data": videos
                                })
                            })
                        except ValueError as e:
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "code": "INVALID_DATA",
                                    "message": str(e)
                                })
                            })
                        except Exception as e:
                            tool_outputs.append({
                                "tool_call_id": tool_call.id,
                                "output": json.dumps({
                                    "status": "error",
                                    "code": "SERVER_ERROR",
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
            else:
                break

        if run.status == 'failed':
            error_msg = f"Assistant run failed with status: {run.status}"
            if hasattr(run, 'last_error'):
                error_msg += f" - {run.last_error}"
            raise RuntimeError(error_msg)

        messages = self.client.beta.threads.messages.list(
            thread_id=thread.id)
        return messages.data[0].content[0].text.value
