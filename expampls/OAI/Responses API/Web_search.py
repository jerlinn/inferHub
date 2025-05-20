from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.responses.create(
  model="gpt-4o-mini", # codex-mini-latest 不支持搜索
  tools=[{ "type": "web_search_preview" }],
  input="What was a positive news story from today?",
)

print(response)