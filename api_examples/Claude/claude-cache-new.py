import requests

url = "https://aihubmix.com/v1/messages"
headers = {
    "content-type": "application/json",
    "x-api-key": "sk-***", # Replace with the key you generated in AiHubMix
    "anthropic-version": "2023-06-01"
}
data = {
    "stream": True,
    "model": "claude-opus-4-20250514",
    "max_tokens": 20000,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
            "type": "text",
            "text": "<the entire contents of 'Pride and Prejudice'>",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
    },
    "messages": [{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}]
}

response = requests.post(url, headers=headers, json=data, stream=True)

# Check response status
if response.status_code == 200:
    # Process the streaming response
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))
else:
    print(f"Error: {response.status_code}, {response.text}")