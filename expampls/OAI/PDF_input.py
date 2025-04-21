from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

# 上传 PDF 文件
file = client.files.create(
    file=open("/Users/jerlin/a-practical-guide-to-building-agents.pdf", "rb"),
    purpose="user_data"
)

# 创建对话请求
completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "file",
                    "file": {
                        "file_id": file.id,
                    }
                },
                {
                    "type": "text",
                    "text": "请从方法部分提取实验参数，包括波长和脉冲频率。"
                },
            ]
        }
    ]
)

print(completion.choices[0].message.content)