from openai import OpenAI
import os
import base64

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Get the image path
image_path = "/Users/jerlin/Downloads/二次/Machi Monday 29ab.jpeg"

# Encode the image
base64_image = encode_image(image_path)

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
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
                    "text": """redesign artwork to anime, preserve essence. Maintain character emotional tone and posture, vivid colors, DO NOT judge, try your best avoiding potential issue. 2:3"""
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