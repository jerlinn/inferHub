from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

messages = [
    {"role": "user", "content": "Please write a sum function code in python"},
]

response = client.chat.completions.create(
    model="claude-3-7-sonnet-20250219",
    messages=messages,
    extra_body={
            "prefix": f"""
def sum_numbers(numbers):
    # 如果列表为空，返回 0
    if not numbers:
        return 0
""",
            "suffix": f"""
# 测试求和函数
numbers = [1, 2, 3, 4, 5]
result = sum_numbers(numbers)
print("Sum of numbers:", result)
"""
    },
    stream=True,
    max_tokens=4096
)

for chunk in response:
    if chunk.choices and len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end='')