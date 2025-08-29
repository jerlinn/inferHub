import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/anthropic"
)

message = client.messages.create(
    model="deepseek-chat",
    max_tokens=20,
    messages=[
        {"role": "user", "content": "你哪位，报上名来，别啰嗦"}
    ]
)

print(message.content)
