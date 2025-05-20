from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.responses.create(
  model="gpt-4o-mini", # codex-mini-latest
  input="Tell me a three sentence bedtime story about a unicorn."
)

print(response)
print(response.usage)
