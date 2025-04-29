from openai import OpenAI
import os

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

completion = client.chat.completions.create(
    model="gemini-2.5-flash-preview-04-17-nothink",
    messages=[
        {
            "role": "user",
            "content": "Explain the Occam's Razor concept and provide everyday examples of it"
        }
    ]
)

print(completion.choices[0].message.content)