import requests
import os

data = {
  "prompt": "Delicate 3D cover design with various combat machines flying from an portal. The machines have different functions and style. The portal is emitting swirling energy. The background contains a futuristic city with tall buildings. The text \"One Gateway, Infinite Models\" is placed in the center with neon lights, expansive view, cinematic lighting, vivid color, bright tone. clean text, cyber punk, smooth render",
  "rendering_speed": "QUALITY", # 新增参数，可选 TURBO/DEFAULT/QUALITY 📍
  "num_images": 2, #integer Optional >=1 <=8 Defaults to 1
  # "seed": "998", # integer Optional >=0 <=2147483647 多张图时不要使用 seed
  "aspect_ratio": "16x9",  # 可选 ['1x3', '3x1', '1x2', '2x1', '9x16', '16x9', '10x16', '16x10', '2x3', '3x2', '3x4', '4x3', '4x5', '5x4', '1x1'] 和 V3 以下不同 📍
  "magic_prompt": "AUTO",
  "style_type": "AUTO", #string Optional AUTO/GENERAL/REALISTIC/DESIGN 类型缩减 📍
  "negative_prompt": "blurry, watermark",
}

# initialize files parameter
files = None

# 样式参考图路径
style_reference_path = "/Users/jerlin/Desktop/a-cinematic-lighting-3d-render.png"
use_reference_image = True

if use_reference_image and os.path.exists(style_reference_path):
    # 如果使用参考图片且文件存在，则设置 files 参数
    files = [
        ("style_reference_images", open(style_reference_path, "rb")),
        # 如果需要添加多个样式参考图片，可以按如下方式添加：
        # ("style_reference_images", open("第二张参考图片路径", "rb")),
    ]
elif use_reference_image:
    print(f"警告：样式参考图片未找到：{style_reference_path}")

response = requests.post(
  "https://aihubmix.com/ideogram/v1/ideogram-v3/generate",
  headers={
    "Api-Key": os.getenv("AIHUBMIX_API_KEY"), # 替换为你的 AIHUBMIX API 密钥
    "App-code": "******",
  },
  data=data,
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