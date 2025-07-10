from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1",
)

completion = client.chat.completions.create(
    extra_headers={"APP-Code":"******"},
    model="veo-3",
    messages=[
        {
            "role": "user",
            "content": "a mechanical butterfly flying in the futuristic garden"
        }
    ],
    stream=False
)

print(completion.choices[0].message.content)