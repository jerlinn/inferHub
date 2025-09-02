import os
import anthropic

# 读取同目录下的反脆弱.md文件
script_dir = os.path.dirname(os.path.abspath(__file__))
md_file_path = os.path.join(script_dir, "v0.md")

with open(md_file_path, 'r', encoding='utf-8') as f:
    user_content = f.read()

client = anthropic.Anthropic(
    api_key=os.getenv("AIHUBMIX_API_KEY"),  # 换成你在 AiHubMix 生成的密钥
    base_url="https://api.aihubmix.com"
)

message = client.messages.create(
    extra_headers={"APP-Code":"******"},
    model="claude-sonnet-4-20250514", # claude-opus-4-20250514, claude-sonnet-4-20250514
    max_tokens=1024,
    messages=[
        {"role": "user", "content": user_content}
    ],
    #betas=["context-1m-2025-08-07"] #aihubmix 暂不支持
)

print(message.content) 