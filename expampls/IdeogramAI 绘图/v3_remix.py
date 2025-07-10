import requests
import os
import re

def get_next_filename(base, ext):
    """
    base: 基础文件名（不含扩展名）
    ext: 扩展名，如 'png'
    返回：递增且不重复的可用文件名，如 output.png、output-1.png、output-2.png ...
    """
    files = os.listdir('.')
    pattern = re.compile(rf'^{re.escape(base)}(?:-(\d+))?\.{re.escape(ext)}$')
    nums = [int(m.group(1)) for f in files if (m := pattern.match(f)) and m.group(1)]
    if f"{base}.{ext}" not in files:
        return f"{base}.{ext}"
    next_num = max(nums, default=0) + 1
    return f"{base}-{next_num}.{ext}"

data = {
  "prompt": "Delicate 3D cover design with various robots flying from an portal. The robot have totally distinct styles - not human shape. The portal is emitting swirling energy. The background contains a futuristic city with tall buildings. The text \"One Gateway, Infinite Models\" is placed in the center with neon lights, expansive view, cinematic lighting, vivid color, bright tone. clean text, smooth render",
  "image_weight": "50",  # integer Optional >=1 <=100 Defaults to 50
  "rendering_speed": "QUALITY",
  "num_images": 2,
  #"seed": 1,
  "aspect_ratio": "16x9",
  "magic_prompt": "AUTO",
  "style_type": "AUTO",
  "negative_prompt": "blurry, watermark",
}

# 原图 - 必填
source_image_path = "/Users/jerlin/Desktop/a-cinematic-lighting-3d-render.png"
if not os.path.exists(source_image_path):
    raise FileNotFoundError(f"源图片未找到：{source_image_path}")

# initialize files parameter
files = None

# 样式参考图路径
style_reference_path = "/Users/jerlin/Desktop/a-cinematic-lighting-3d-render.png"
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
    for i, item in enumerate(response_json['data']):
        image_data = item.get('url')
        if not image_data:
            print(f"第{i+1}张图片缺少 URL，跳过。")
            continue
        image_response = requests.get(image_data)
        if image_response.ok:
            filename = get_next_filename('output', 'png')
            with open(filename, 'wb') as f:
                f.write(image_response.content)
            print(f"图片已保存到 {filename}")
        else:
            print(f"第{i+1}张图片获取失败：{image_response.status_code}")
else:
    print("API 请求失败或返回数据中没有图片")
    print(f"错误详情：{response_json}")