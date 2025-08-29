import os
import anthropic
from anthropic.types import MessageStreamEvent

client = anthropic.Anthropic(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://api.aihubmix.com"
)

with client.messages.stream(
    model="claude-sonnet-4-20250514",  # claude-opus-4-20250514, claude-sonnet-4-20250514
    max_tokens=500,
    messages=[
        {"role": "user", "content": "hi"},
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)