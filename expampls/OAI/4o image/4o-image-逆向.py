from openai import OpenAI
import os

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥 
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
                    "text": """redesign poster of the movie [Black Swam], 3D cartoon, smooth render, bright tone, 2:3
"""
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