import requests
import os

# https://x.com/intent/follow?screen_name=eviljer
# Get Key: https://aihubmix.com?aff=m6tE

url = "https://aihubmix.com/ideogram/generate"

payload = { "image_request": {
        "prompt": "3D cartoon, An adorable white owl baby with tilted head, shiny amber eyes with highlight, fluffy body, standing on a trunk with moss and lots of glowing mushrooms, Close up, cinematic lighting, low angle, deep sense of depth. The background is a magical spring landscape, cute and esthetic, huge title design \"Always Curious\"", #中文支持还不太好
        "negative_prompt": "blurry, bad anatomy, watermark", #仅适用于模型版本 V_1、V_1_TURBO、V_2 和 V_2_TURBO
        "aspect_ratio": "ASPECT_16_9",  # 可选 ASPECT_1_1(Default), ASPECT_3_2, ASPECT_2_3, ASPECT_4_3, ASPECT_3_4, ASPECT_16_9, ASPECT_9_16, SPECT_16_10, ASPECT_10_16
        "model": "V_3",
        "num_images": 1, #integer Optional >=1 <=8 Defaults to 1
        "magic_prompt_option": "AUTO", #string Optional AUTO, ON, OFF
        #"seed": "2" #integer Optional >=0 <=2147483647
        #"style_type": "RENDER_3D" #string Optional AUTO/GENERAL/REALISTIC/DESIGN/RENDER_3D/ANIME, 仅适用于 V_2 及以上版本
    } }
headers = {
    "Api-Key": os.getenv("AIHUBMIX_API_KEY"),
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())