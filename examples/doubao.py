from openai import OpenAI
import os

def send_messages(messages):
    response = client.chat.completions.create(
        model="doubao-seed-1-6-250615",
        messages=messages,
        tools=tools
    )
    return response.choices[0].message

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 Replace with your own API key
    base_url="https://aihubmix.com/v1"
)

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather of an location, the user shoud supply a location first",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"]
            },
        }
    },
]

messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
message = send_messages(messages)
print(f"User>\t {messages[0]['content']}")

tool = message.tool_calls[0]
messages.append(message)

messages.append({"role": "tool", "tool_call_id": tool.id, "content": "53°F"})
message = send_messages(messages)
print(f"Model>\t {message.content}")