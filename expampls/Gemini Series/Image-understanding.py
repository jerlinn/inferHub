from google import genai
from google.genai import types
import os

# 读取文件为二进制数据
file_path = "/Users/jerlin/Desktop/Gloucester_at_Twilight.jpg"
with open(file_path, "rb") as f:
    file_bytes = f.read()

client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"}
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=types.Content(
        parts=[
            types.Part(
                inline_data=types.Blob(
                    data=file_bytes,
                    mime_type="image/jpeg"
                )
            ),
            types.Part(
                text="用一个简洁、优美的叙述段落来描述这张图片，输出为英语。"
            )
        ]
    ),
    config=types.GenerateContentConfig(
        system_instruction="You are a helpful assistant that can describe images.",
        max_output_tokens=768,
        temperature=0.1,
        thinking_config=types.ThinkingConfig(
            thinking_budget=0, include_thoughts=False
        ),
        media_resolution=types.MediaResolution.MEDIA_RESOLUTION_MEDIUM # 256 tokens
    )
)

print(response.text)
print(response.usage_metadata)