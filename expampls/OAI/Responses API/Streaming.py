from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.responses.create(
  model="codex-mini-latest",
  instructions="You are a helpful assistant.",
  input="Hello!",
  stream=True
)

for event in response:
  print(event)