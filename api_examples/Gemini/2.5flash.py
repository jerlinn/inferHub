from google import genai
from google.genai import types
import os

def generate():
    client = genai.Client(
        api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
    )

    model = "gemini-2.5-flash" #gemini-2.5-pro-preview-03-25、gemini-2.5-flash-preview-04-17
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""generate image: an adorable mermaid in the sea, bold outline, chibi cartoon, in the style of Children coloring book, super cute, B&W, HD"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=2048, #范围 0-24576。默认 1024，最佳边际效果 16000
        ),
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