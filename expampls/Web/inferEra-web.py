import requests
import json
import os

try:
    response = requests.post(
        url="https://aihubmix.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ.get('AIHUBMIX_API_KEY')}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "grok-3-beta",
            "search_parameters": {"mode": "auto"},
            "messages": [
                {
                    "role": "user",
                    "content": "@eviljer 最新的热门帖子说了什么"
                }
            ]
        })
    )

    result = response.json()
    print("API 响应：", json.dumps(result, ensure_ascii=False, indent=2))

except requests.exceptions.RequestException as e:
    print(f"请求错误：{e}")
except json.JSONDecodeError as e:
    print(f"JSON 解析错误：{e}")
except Exception as e:
    print(f"其他错误：{e}")
