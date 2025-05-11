from google import genai
from google.genai import types

def generate():
    client = genai.Client(
        api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
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

    print(client.models.generate_content(
        model=model,
        contents=contents,
    ))

if __name__ == "__main__":
    generate()