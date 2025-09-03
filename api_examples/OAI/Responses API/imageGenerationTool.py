from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://api.aihubmix.com/v1"
)

response = client.responses.create(
    model="gpt-4o",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

# Save the image to a file
image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))