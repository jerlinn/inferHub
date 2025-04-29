from google import genai
from google.genai import types

# 读取文件为二进制数据
file_path = "yourpath/file.jpeg"
with open(file_path, "rb") as f:
    file_bytes = f.read()

client = genai.Client(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"}
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=types.Content(
        parts=[
            types.Part(
                inline_data=types.Blob(
                    data=file_bytes,
                    mime_type="image/jpeg"
                )
            ),
            types.Part(
                text="Describe the image."
            )
        ]
    )
)

print(response.text)