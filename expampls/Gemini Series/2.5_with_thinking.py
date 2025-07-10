from google import genai
from google.genai import types
import time
import os

def generate():
    client = genai.Client(
        api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
    )

    model = "gemini-2.5-pro-preview-05-06"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""金融领域的「72 法则」是如何推导的？"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        thinking_config=types.ThinkingConfig(
            include_thoughts=True  # 🧠 启用思考过程输出
        ),
    )

    # 用于存储最后一个 chunk 的 usage_metadata
    final_usage_metadata = None
    
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        # 检查是否有内容部分
        if chunk.candidates and len(chunk.candidates) > 0:
            for part in chunk.candidates[0].content.parts:
                if part.text:
                    if part.thought:
                        # 思考过程内容
                        print(part.text, end="")
                    else:
                        # 最终答案内容
                        print(part.text, end="")
        
        # 保存最新的 usage_metadata，只有最后一个 chunk 会包含完整信息
        if chunk.usage_metadata:
            final_usage_metadata = chunk.usage_metadata
    
    # 在所有 chunk 处理完后，打印完整的 token 使用情况
    if final_usage_metadata:
        print(f"\n\n📊 Token 使用情况:")
        print(f"思考 tokens: {getattr(final_usage_metadata, 'thoughts_token_count', '不可用')}")
        print(f"输出 tokens: {getattr(final_usage_metadata, 'candidates_token_count', '不可用')}")
        print(f"总计: {final_usage_metadata}")

if __name__ == "__main__":
    generate()
