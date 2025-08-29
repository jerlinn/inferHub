from google import genai
from google.genai import types
import time
import os

def generate():
    client = genai.Client(
        api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
    )
    model = "gemini-2.5-pro"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""金融领域的「72 法则」是如何推导的？"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        response_mime_type="text/plain",
    )

    # 用于存储最后一个 chunk 的 usage_metadata
    final_usage_metadata = None
    
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")
        # 保存最新的 usage_metadata，只有最后一个 chunk 会包含完整信息
        if chunk.usage_metadata:
            final_usage_metadata = chunk.usage_metadata
    
    # 在所有 chunk 处理完后，打印完整的 token 使用情况
    if final_usage_metadata:
        print(f"\nUsage: {final_usage_metadata}")

if __name__ == "__main__":
    generate()
