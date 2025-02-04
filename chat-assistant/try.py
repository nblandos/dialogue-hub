import os
from dotenv import load_dotenv
import base64
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Load environment variables from .env file
load_dotenv()

# Access the variables
url = os.getenv("LINK")
key = os.getenv("KEY")

# Configuration
endpoint = os.getenv("ENDPOINT_URL", f"{url}")
subscription_key = os.getenv("SUBSCRIPTION_KEY", f"{key}")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-4")

# Initialize Azure OpenAI Service client
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2024-05-01-preview",
)

# Initial system prompt
chat_history = [
    {"role": "system", "content": "You are an AI assistant that helps people find information."}
]

print("Chat with GPT! Type 'exit' to end the conversation.\n")

while True:
    user_input = input("You: ")
    
    if user_input.lower() == "exit":
        print("Goodbye!")
        break

    # Append user message
    chat_history.append({"role": "user", "content": user_input})

    # Get response from Azure OpenAI
    response = client.chat.completions.create(
        model=deployment,
        messages=chat_history,
        max_tokens=800,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False
    )

    # Extract and print response
    ai_response = response.choices[0].message.content
    print(f"GPT: {ai_response}\n")

    # Append assistant response to chat history
    chat_history.append({"role": "assistant", "content": ai_response})
