from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.responses.create(
    model="codex-mini-latest", # 支持 codex-mini-latest, o4-mini, o3-mini, o3, o1
    input="How much wood would a woodchuck chuck?",
    reasoning={
        "effort": "medium" #支持 low, medium, high
    }
)

print(response)