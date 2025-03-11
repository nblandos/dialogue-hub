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

        faq_instructions = "Frequently Asked Questions:\n"
        faq_responses = [
            ("GENERAL INFORMATION", "."),
            ("What is Dialogue Café?", "Dialogue Café is an inclusive coffee space where deaf and hard-of-hearing individuals work as baristas, offering a unique experience that promotes British Sign Language (BSL) and deaf culture. Our aim is to create an interactive and welcoming environment where customers can engage in sign language while enjoying high-quality coffee and food."),
            ("Where is Dialogue Café located?", "Currently, Dialogue Café operates at the University of East London Docklands Campus within the Royal Docks Centre for Sustainability. A second location is set to open in Stratford (Newham) around April-May 2025."),
            ("What are the opening hours of Dialogue Café?",
             "Currently, Monday to Thursday between 08:00-17:00 Friday 08:00-13:00. Dialogue Café is closed on weekends."),
            ("How can I contact Dialogue Café?", "You can reach us via: Email: info@dialoguehub.co.uk, Social Media: Instagram: dialogue.hub, LinkedIn : Dialogue Hub and Dialogue Café UK, Website: www.dialoguehub.co.uk"),
            ("Is there a membership or sign-up required to visit?",
             "No, Dialogue Café is open to everyone! You do not need a membership or prior sign-up to visit. Simply drop by, place an order, and enjoy your experience."),
            ("ORDERING AND MENU", "."),
            ("What's British Sign Language (BSL)?", "British Sign Language (BSL) is the primary language of the deaf community in the UK. It uses hand movements, facial expressions, and body language to communicate. At Dialogue Café, we encourage customers to engage with BSL by ordering using sign language, making it a fun and interactive experience."),
            ("How do I order food and drinks in BSL?", "Ordering in BSL is simple! Our café provides easy-to-follow visual guides, and our friendly deaf baristas are happy to assist you. You can also use our digital screens with step-by-step instructions to learn and sign your order. If you're new to BSL, don't worry—we'll guide you through the process and make it an enjoyable experience"),
            ("What payment methods do you accept?",
             "We are cashless and we accept all major credit and debit cards, contactless payments, and mobile wallets (Apple Pay, Google Pay)."),
            ("Do you offer vegetarian or vegan options?",
             "Yes, we offer a variety of vegetarian and vegan options on our menu."),
            ("Can I see the menu online?",
             "Yes, our menu is available on our website at www.dialoguehub.co.uk."),
            ("Do you have gluten-free options?",
             "Yes, we offer gluten-free options on our menu."),
            ("Are there any special promotions or discounts available?",
             "We are currently applying 15% to UEL Students."),
            ("Can I place an order in advance?",
             "Currently, we do not accept advance orders."),
            ("FACILITIES AND SERVICES", "."),
            ("Do you provide Wi-Fi for customers?",
             "Yes, we offer free Wi-Fi for all customers."),
            ("Is there a quiet space for studying or working?",
             "Yes, we have a designated quiet area for studying or working."),
            ("Do you have accessibility features for people with disabilities?",
             "Yes, Dialogue Café is designed to be accessible to everyone, including individuals with disabilities. We have wheelchair ramps, accessible restrooms, and staff trained in British Sign Language (BSL) to assist customers."),
            ("Do you offer take-away or delivery services?",
             "Yes, we offer take-away services. Delivery services are not available at the moment."),
            ("EVENTS AND COMMUNITY", "."),
            ("Does Dialogue Café host any events or workshops?",
             "Yes. We do have school workshop and corporate workshop programmes. We are currently working on our event calendar."),
            ("Can I get more information on School Workshop programme?",
             "Yes. It's on our web page. For more details, please contact us via email."),
            ("Can I get more information on Corporate Workshop Programme?",
             "Yes. It's on our web page. For more details, please contact us via email."),
            ("How can I participate in events at the café?",
             "It's free and open to public. For more details, please contact us via email."),
            ("Can I host my own event at Dialogue Café",
             "Yes. It's on our web page. For more details, please contact us via email."),
            ("Are there networking opportunities at the café?",
             "Yes. For more details, please contact us via email."),
            ("Can I speak to a staff member if my question isn't answered by D-Bot?",
             "Yes. Any questions can be also answered through info@dialoguehub.co.uk"),
        ]

        for question, answer in faq_responses:
            if answer == ".":
                faq_instructions += f"\n## {question}\n"
            else:
                faq_instructions += f"Q: {question}\nA: {answer}\n\n"

        base_instructions = (
            f"You are an AI Assistant called D-Bot for Dialogue Hub's British Sign Language Cafe. "
            f"Today's date is {current_date}. "
            "Help users with information about the Cafe, BSL queries and menu videos, accessibility needs, "
            "and booking assistance. Create bookings when users request them. Provide BSL videos when users request them.\n"
            "Opening Hours:\n"
            "- Monday to Thursday: 8:00 AM - 5:00 PM (08:00-17:00), \n"
            "- Friday: 8:00 AM - 1:00 PM (08:00-13:00)\n"
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
            "When helping with BSL or Menu or Training Videos:\n"
            "- You can share British Sign Language (BSL) videos from our library\n"
            "- When users ask about menu items or learning BSL, share video links from this format: [VIDEO:category:item_name], category is either 'menu' or 'training'\n"
            "- If a user asks about a menu item, suggest a video of that item\n"
            "- If a user asks about a training phrase, suggest a video of that phrase\n"
            "- Do not share videos for items not in our library\n"
            "- If a menu item is unavailable, search for similar items\n"
            "- Do not suggest more than 5 videos at a time\n"
            "- If a user asks about learning BSL or seeing signs, suggest some videos they might be interested in\n"
            "- The frontend will automatically convert these links to embedded videos\n"
        )

        return base_instructions + "\n" + faq_instructions

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
            temperature=1,
            top_p=0.9
        )

    def _create_assistant(self):
        """Create a new assistant"""
        return self.client.beta.assistants.create(
            name="D-Bot",
            model=self.deployment,
            instructions=self._get_instructions(),
            tools=self._get_tools(),
            tool_resources={},
            temperature=1,
            top_p=0.9
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
