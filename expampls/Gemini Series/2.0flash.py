from google import genai
from google.genai import types
import os

def generate():
    client = genai.Client(
        api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={
            "base_url": "https://api.aihubmix.com/gemini",
            "headers": {
                "APP-Code": "******"
            }
        },
    )
    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""对于普通股票投资者：分析财报有用的话，还要运气做什么？"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")
        # The usage_metadata provides detailed token counts.
        print(chunk.usage_metadata)

if __name__ == "__main__":
    generate()
