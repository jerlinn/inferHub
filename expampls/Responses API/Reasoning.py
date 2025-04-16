from openai import OpenAI
import os

# 🚧 无响应，修复中

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1/"
)

response = client.responses.create(
    model="o3-mini",
    input="How much wood would a woodchuck chuck?",
    reasoning={
        "effort": "high"
    }
)

print(response)