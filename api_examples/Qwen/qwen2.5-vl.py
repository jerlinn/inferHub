from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

# 图片路径
image_path = "yourpath/file.png"

# 读取并编码图片
def encode_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"图片文件不存在：{image_path}")
    
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# 获取图片的 base64 编码
base64_image = encode_image(image_path)

# 创建包含文本和图像的消息
completion = client.chat.completions.create(
    model="Qwen/QVQ-72B-Preview", #qwen2.5-vl-72b-instruct 或 Qwen/QVQ-72B-Preview
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "请详细描述这张图片，包括图片中的内容、风格和可能的含义。"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"
                    }
                }
            ]
        }
    ],
    stream=True
)

for chunk in completion:
    # 安全地检查是否有内容
    if hasattr(chunk.choices, '__len__') and len(chunk.choices) > 0:
        if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")