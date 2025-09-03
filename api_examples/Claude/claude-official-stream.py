import os
import anthropic
from anthropic.types import MessageStreamEvent

client = anthropic.Anthropic(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com"
)

with client.messages.stream(
    model="claude-sonnet-4-20250514",  # claude-opus-4-20250514, claude-sonnet-4-20250514
    max_tokens=128000,
    messages=[
        {"role": "user", "content": "请生成一篇 10 万 tokens 的文章，分别用详细的段落讲解查理芒格 100 个思维模型（即每个模型约 1000 tokens），每个模块都包含模型介绍段落、多维思考、应用方法、实操盲区、具体案例。通俗易懂和引人入胜是关键。仅在需要的时候列点。"},
    ],
    extra_headers={
        "anthropic-beta": "output-128k-2025-02-19"
    }
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)