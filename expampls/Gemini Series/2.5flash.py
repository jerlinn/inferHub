from google import genai
from google.genai import types

def generate():
    client = genai.Client(
        api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
    )

    model = "gemini-2.5-flash-preview-04-17" #gemini-2.5-pro-preview-03-25、gemini-2.5-flash-preview-04-17
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""对于普通股票投资者：分析财报有用的话，还要运气做什么？"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=2048, #范围 0-24576。默认 1024，最佳边际效果 16000
        ),
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate()