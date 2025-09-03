import requests
import os

# 原图 - 必填
source_image_path = "/Users/jerlin/inferHub/expampls/IdeogramAI 绘图/img/cover-jerlin.jpeg"
# mask - 必填
mask_image_path = "/Users/jerlin/inferHub/expampls/IdeogramAI 绘图/img/mask.jpg"

if not os.path.exists(source_image_path):
    raise FileNotFoundError(f"源图片未找到：{source_image_path}")

with open(source_image_path, "rb") as image_file, open(mask_image_path, "rb") as mask_file:
    response = requests.post(
        "https://aihubmix.com/ideogram/v1/ideogram-v3/edit",
        headers={
            "Api-Key": "sk-***" # 替换为你的 AIHUBMIX API 密钥
        },
        data={
            "prompt": "remove text",
            "rendering_speed": "DEFAULT",
            "num_images": 1,
            "seed": 1,
            "aspect_ratio": "16x9",
            "magic_prompt": "AUTO",
            "style_type": "AUTO",
            "negative_prompt": "blurry, bad anatomy, watermark",
        },
        files={
            "image": image_file,
            "mask": mask_file,
        }
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