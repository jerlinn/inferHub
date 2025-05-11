from google import genai
from google.genai import types

# 读取文件为二进制数据
file_path = "macro_china_supply_of_money.csv"
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
                    mime_type="text/csv"
                )
            ),
            types.Part(
                text="Please analyze this CSV and summarize the key statistics. Use code execution if needed."
            )
        ]
    ),
    config=types.GenerateContentConfig(
        tools=[types.Tool(
            code_execution=types.ToolCodeExecution
        )]
    )
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    if getattr(part, "executable_code", None) is not None:
        print("Generated code:\n", part.executable_code.code)
    if getattr(part, "code_execution_result", None) is not None:
        print("Execution result:\n", part.code_execution_result.output)