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
            "model": "gpt-4o-mini:surfing", # 模型 id 后面追加 :surfing 即可支持搜索
            "messages": [
                {
                    "role": "user",
                    "content": "Search the last fact about ChatGPT memory feature, return with the URL"
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

"""
API 响应： {
  "id": "chatcmpl-BLMY8YIKvcjNpiFmyvIfEGQMvPAAh",
  "model": "gpt-4o-mini-2024-07-18",
  "object": "chat.completion",
  "created": 1744431268,
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "ChatGPT 最近获得了重大的记忆功能升级，现在能够参考用户的所有过去对话，以提供更个性化的回应。用户可以选择不让 ChatGPT 记住这些信息，或完全退出记忆功能。有关此更新的更多信息可以在以下网址找到：[https://www.digitaltrends.com/computing/openai-chatgpt-memory-update/](https://www.digitaltrends.com/computing/openai-chatgpt-memory-update/)"
      },
      "finish_reason": "stop"
    }
  ],
  "system_fingerprint": "fp_b705f0c291",
  "usage": {
    "prompt_tokens": 584,
    "completion_tokens": 99,
    "total_tokens": 683,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
"""