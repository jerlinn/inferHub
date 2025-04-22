from openai import OpenAI
import os
import base64

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Get the image path
image_path = "/Users/jerlin/Desktop/Portland_Head_Light__Maine.jpg"

# Encode the image
base64_image = encode_image(image_path)

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

# 创建聊天完成请求
stream = client.chat.completions.create(
    model="gpt-4o-image", #gpt-4o-image-vip, gpt-4o-image
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": """convert the image into the style of ghibli, bright tone. 3:2"""
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ],
    stream=True
)

# 使用 for 循环处理流式响应
for chunk in stream:
    try:
        if chunk.choices and len(chunk.choices) > 0 and chunk.choices[0].delta and chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
    except Exception as e:
        print(f"\n处理响应时出现错误：{str(e)}")