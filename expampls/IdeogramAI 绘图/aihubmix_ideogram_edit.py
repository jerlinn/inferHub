import requests
import os

# https://x.com/intent/follow?screen_name=eviljer
# Get Key: https://aihubmix.com?aff=m6tE

url = "https://api.aihubmix.com/ideogram/edit"

files = {
    "image_file": open('/Users/jerlin/inferHub/expampls/IdeogramAI 绘图/img/cover-jerlin.jpeg', 'rb'),  #Required
    "mask": open('/Users/jerlin/inferHub/expampls/IdeogramAI 绘图/img/mask.jpg', 'rb')  #Required
}

payload = {
        "prompt": "preserve style, remove text", #Required
        "model": "V_2",  #Required, only supported for V_2 and V_2_TURBO.
        "magic_prompt_option": "AUTO", #string Optional AUTO, ON, OFF
        "num_images": 1, #integer Optional >=1 <=8 Defaults to 1
        "seed": "440650482", #integer Optional >=0 <=2147483647
        "style_type": "AUTO" #string Optional AUTO/GENERAL/REALISTIC/DESIGN/RENDER_3D/ANIME, 仅适用于 V_2 及以上版本
    }
headers = {"Api-Key": os.getenv("AIHUBMIX_API_KEY")}

response = requests.post(url, data=payload, files=files, headers=headers)

print(response.json())

# 关闭文件
files["image_file"].close()
files["mask"].close()