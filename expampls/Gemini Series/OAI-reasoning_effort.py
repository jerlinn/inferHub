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
            "content": "Explain the Occam's Razor concept and provide everyday examples of it"
        }
    ],
    stream=True
)

#print(completion.choices[0].message.content)

for chunk in completion:
    print(chunk.choices[0].delta)