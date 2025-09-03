import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com"
)

# 5 分钟缓存
with client.messages.stream(
    model="claude-opus-4-20250514",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing literary works."
        },
        {
            "type": "text", 
            "text": "<the entire contents of 'Pride and Prejudice'>",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}
    ]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)