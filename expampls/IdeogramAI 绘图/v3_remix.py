import requests
import os

data = {
  "prompt": "bird playing with a cat in the snow, pixel art style",
  "image_weight": "60",  # integer Optional >=1 <=100 Defaults to 50
  "rendering_speed": "QUALITY",
  "num_images": 1,
  "seed": 1,
  "aspect_ratio": "16x9",
  "magic_prompt": "AUTO",
  "style_type": "AUTO",
  "negative_prompt": "blurry, bad anatomy, watermark",
}

# 原图 - 必填
source_image_path = "/Users/jerlin/inferHub/expampls/IdeogramAI 绘图/img/cover-jerlin.jpeg"
if not os.path.exists(source_image_path):
    raise FileNotFoundError(f"源图片未找到：{source_image_path}")

# initialize files parameter
files = None

# 样式参考图路径
style_reference_path = "/Users/jerlin/Downloads/ChatGPT Image May 1, 2025, 03_32_47 PM.png"
use_reference_image = True

# 准备文件上传
with open(source_image_path, "rb") as image_file:
    if use_reference_image and os.path.exists(style_reference_path):
        # 如果使用参考图片且文件存在，则设置 files 参数
        files = {
            "image": image_file,
            "style_reference_images": open(style_reference_path, "rb"),
        }
    else:
        if use_reference_image:
            print(f"警告：样式参考图片未找到：{style_reference_path}")
        files = {
            "image": image_file,
        }

    response = requests.post(
      "https://aihubmix.com/ideogram/v1/ideogram-v3/remix",
      headers={
        "Api-Key": "sk-***" # 替换为你的 AIHUBMIX API 密钥
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
    print(f"错误详情：{response_json}")