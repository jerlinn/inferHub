import requests
import os
import json

url = 'https://aihubmix.com/v1/chat/completions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {os.getenv("AIHUBMIX_API_KEY")}' # 替换为你的 AiHubMix 密钥
}

data = {
    "model": "jina-deepsearch-v1",
    "messages": [
        {
            "role": "user",
            "content": "what's the latest blog post from jina ai?"
        }
    ],
    "stream": True
}

# Use stream=True in the request to handle streaming responses
response = requests.post(url, headers=headers, json=data, stream=True)

# Check if the request was successful
if response.status_code == 200:
    # Iterate over the response content line by line
    for line in response.iter_lines():
        if line:
            # Decode line and print (assuming SSE format: "data: {...}")
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith('data: '):
                # Handle potential end signal like "data: [DONE]"
                if decoded_line[len('data: '):].strip() == '[DONE]':
                    print("\nStream finished.")
                    break
                try:
                    # Extract the JSON part
                    json_data = json.loads(decoded_line[len('data: '):])
                    # Process the JSON data
                    if 'choices' in json_data and len(json_data['choices']) > 0:
                        delta = json_data['choices'][0].get('delta', {})
                        content_to_print = delta.get('content') or delta.get('reasoning_content') # Check both fields

                        if content_to_print:
                            print(content_to_print, end='', flush=True)
                except json.JSONDecodeError:
                    # Ignore lines that are not valid JSON after "data: "
                    # print(f"\nCould not decode JSON from line: {decoded_line}")
                    pass # Optionally log or handle non-JSON data lines if needed
            # Handle lines that don't start with "data: " if necessary
            # else:
            #    print(f"Received non-data line: {decoded_line}")

    print() # Add a newline at the end
elif response.status_code == 401:
     print(f"Error: {response.status_code} - Unauthorized. Please check your API key.")
     try:
         print(response.json())
     except json.JSONDecodeError:
         print(response.text)
else:
    print(f"Error: {response.status_code}")
    try:
        print(response.json()) # Print error details if available
    except json.JSONDecodeError:
        print(response.text) # Print raw text if not JSON