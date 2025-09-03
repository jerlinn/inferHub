from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

chat_completion = client.chat.completions.create(
    model="gemini-2.0-flash-exp",
    # 🌐 引入搜索功能，需要升级 openai 包：pip install -U openai
    web_search_options={},
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "搜索梵高在 Google Arts & Culture 上的相关页面，写一段生动的人物介绍，并提供相关的准确链接。"
                }
            ]
        }
    ]
)

print(chat_completion.choices[0].message.content)