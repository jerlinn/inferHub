from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
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