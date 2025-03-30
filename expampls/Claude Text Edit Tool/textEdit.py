import anthropic

client = anthropic.Anthropic(
    api_key="sk-***",
    base_url="https://aihubmix.com"
)

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)

print("Response content:")
for message in response.content:
    print(message.text)

"""
## 需要安装 anthropic 包：
pip install anthropic

## Response content 示例：
I'll help you fix the syntax error in your primes.py file. First, let's view the file to see what's wrong.
"""