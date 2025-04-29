from google import genai
from google.genai import types

# 读取文件为二进制数据
file_path = "yourpath/file.mp4"
with open(file_path, "rb") as f:
    file_bytes = f.read()

"""
Aihubmix 只支持小于 20MB 的文件，用 inline_data 上传
大于 20M 的多媒体需要用 File API（目前我们不支持），待完善状态跟踪，返回 upload_url
URL 测试：https://www.youtube.com/watch?v=OoU7PwNyYUw
"""

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
                    mime_type="video/mp4"
                )
            ),
            types.Part(
                text="Summarize this video. Then create a quiz with an answer key based on the information in this video."
            )
        ]
    )
)

print(response.text)