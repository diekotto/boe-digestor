from dotenv import load_dotenv
import os
import anthropic

# Load environment variables from .env file
load_dotenv()

client = anthropic.Anthropic(
  # Now the API key is loaded from the environment variable
  api_key=os.getenv("ANTHROPIC_API_KEY"),
)

message = client.messages.create(
  model="claude-3-opus-20240229",
  max_tokens=1000,
  temperature=0.0,
  system="Respond only in Yoda-speak.",
  messages=[
    {"role": "user", "content": "How are you today?"}
  ]
)

print(message.content)
