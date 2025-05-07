import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("AIHUBMIX_API_KEY"),  # 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com"
)

message = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)

print(message.content) 