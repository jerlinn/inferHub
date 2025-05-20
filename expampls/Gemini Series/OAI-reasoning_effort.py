from openai import OpenAI

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

completion = client.chat.completions.create(
    model="gemini-2.5-flash-preview-04-17",
    reasoning_effort="low", #"low", "medium", and "high", which behind the scenes we map to 1K, 8K, and 24K thinking token budgets. If you want to disable thinking, you can set the reasoning effort to "none".
    messages=[
        {
            "role": "user",
            "content": "金融领域的「72 法则」是如何推导的？"
        }
    ],
    stream=True
)

#print(completion.choices[0].message.content)

for chunk in completion:
    # 打印内容部分
    print(chunk.choices[0].delta)
    # 只在最后一个 chunk（包含完整 usage 数据）时打印 usage 信息
    if chunk.usage and chunk.usage.completion_tokens > 0:
        print(f"输出 tokens: {chunk.usage.completion_tokens}")
        print(f"输入 tokens: {chunk.usage.prompt_tokens}")
        print(f"总 tokens: {chunk.usage.total_tokens}")