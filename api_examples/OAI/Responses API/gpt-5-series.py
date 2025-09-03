from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.responses.create(
    model="gpt-5-chat-latest", # gpt-5, gpt-5-chat-latest, gpt-5-mini, gpt-5-nano
    input="塔罗占卜为何有效，背后的原理和可迁移的方法是什么？Output format: Markdown", # GPT-5 默认不使用 Markdown 格式输出，需要明确指定。
    # reasoning={ "effort": "minimal" },
      # 推理深度 - Controls how many reasoning tokens the model generates before producing a response. value can be "minimal", "medium", "high", default is "medium"
      # minimal 仅在 gpt-5 系列支持
    text={"verbosity": "medium"},
      # 输出篇幅 - Verbosity determines how many output tokens are generated. value can be "low", "medium", "high", Models before GPT-5 have used medium verbosity by default. 
      # gpt-5-chat-latest 仅支持 medium
    #stream=True
)

#for event in response:
#  print(event)

print(response)