import requests
import os

# https://x.com/intent/follow?screen_name=eviljer
# Get Key: https://aihubmix.com?aff=m6tE

# url = "https://api.ideogram.ai/v1/ideogram-v3/generate"
# V3 专用端点 📍

url = "https://aihubmix.com/ideogram/v1/ideogram-v3/generate"

# 根据官方文档修正请求格式，将参数直接放在顶层
# 不能指定模型版本，V3 专用 📍
payload = {
    "prompt": "a beautiful spring landscape, wood text \"PulseTrader\" standing in the wild, wide shot, fantasy, photorealistic, cinematic lighting, vivid colors", 
    "negative_prompt": "blurry, bad anatomy, watermark", #仅适用于模型版本 V_1、V_1_TURBO、V_2 和 V_2_TURBO
    "aspect_ratio": "16x9",  # 可选 ['1x3', '3x1', '1x2', '2x1', '9x16', '16x9', '10x16', '16x10', '2x3', '3x2', '3x4', '4x3', '4x5', '5x4', '1x1'] 和 V3 以下不同 📍
    "num_images": 1, #integer Optional >=1 <=8 Defaults to 1
    "magic_prompt": "AUTO", #string Optional AUTO, ON, OFF
    "rendering_speed": "QUALITY", #string Optional TURBO/QUALITY/DEFAULT
    #"seed": 2 #integer Optional >=0 <=2147483647
    #"style_type": "RENDER_3D" #string Optional AUTO/GENERAL/REALISTIC/DESIGN/RENDER_3D/ANIME, 仅适用于 V_2 及以上版本
}

headers = {
    "Api-Key": os.getenv("AIHUBMIX_API_KEY"),
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())