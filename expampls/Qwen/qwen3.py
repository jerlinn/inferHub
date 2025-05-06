from openai import OpenAI

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

completion = client.chat.completions.create(
    model="Qwen/Qwen3-30B-A3B",
    messages=[
        {
            "role": "user",
            "content": "Explain the Occam's Razor concept and provide everyday examples of it"
        }
    ],
    stream=True
)

#print(completion)
for chunk in completion:
    # 安全地检查是否有内容
    if hasattr(chunk.choices, '__len__') and len(chunk.choices) > 0:
        if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")