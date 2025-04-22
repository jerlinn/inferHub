from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

stream = client.chat.completions.create(
    model="gpt-4o-image-vip", #list: gpt-4o-image-vip, gpt-4o-image
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": """a sweet mermaid princess on the rock, with shell tops, in the style of Ghibli, golden hour, detailed, avoid noises, 2:3"""
                }
            ]
        }
    ],
    stream=True
)

for chunk in stream:
    try:
        if chunk.choices and len(chunk.choices) > 0 and chunk.choices[0].delta and chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
    except Exception as e:
        print(f"\n处理响应时出现错误：{str(e)}")