import requests
import os

# 准备请求数据 - 使用字典而不是JSON
data = {
  "prompt": "Delicate 3D cover design with various combat machines flying from an portal. The machines have different shapes, sizes, and colors. The portal is emitting swirling energy. The background contains a futuristic city with tall buildings. The text \"One Gateway, Infinite Models\" is placed in the center with neon lights, expansive view, cinematic lighting, vivid color, bright tone. clean text, cyber punk, smooth render",
  "rendering_speed": "QUALITY",
  "num_images": "2",
  "aspect_ratio": "2x1",
  "magic_prompt": "AUTO",
  "style_type": "AUTO",
  "negative_prompt": "blurry, watermark"
}

# Content-Type 为 multipart/form-data
files = {}
for key, value in data.items():
    files[key] = (None, str(value))  # 将每个数据字段作为表单字段发送

response = requests.post(
  "https://aihubmix.com/ideogram/v1/ideogram-v3/generate",
  headers={
    "Api-Key": "sk-***" # 替换为你的 AIHUBMIX API 密钥
  },
  files=files
)
print(response.json())

# save output image to file
response_json = response.json()
if response.ok and 'data' in response_json and len(response_json['data']) > 0:
    image_data = response_json['data'][0]['url']  # 正确获取图片 URL
    image_response = requests.get(image_data)
    if image_response.ok:
        with open('output.png', 'wb') as f:
            f.write(image_response.content)
        print("图片已保存到 output.png")
    else:
        print(f"获取图片失败：{image_response.status_code}")
else:
    print("API 请求失败或返回数据中没有图片")