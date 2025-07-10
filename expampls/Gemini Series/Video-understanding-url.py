from google import genai
from google.genai import types
import os

client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"}
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=types.Content(
        parts=[
            types.Part(
                file_data=types.FileData(
                    file_uri="https://www.youtube.com/watch?v=OoU7PwNyYUw"
                )
            ),
            types.Part(
                text="Please summarize the video in 3 sentences."
            )
        ]
    )
)

print(response.text)