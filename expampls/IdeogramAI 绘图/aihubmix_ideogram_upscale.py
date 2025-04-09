import requests
import os
from PIL import Image

# https://x.com/intent/follow?screen_name=eviljer
# Get Key: https://aihubmix.com?aff=m6tE

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

url = "https://api.aihubmix.com/ideogram/upscale"

# Open the original image
original_image_path = os.path.join(script_dir, 'img', 'Monstera-variegata-compressed.png')
image = Image.open(original_image_path)

# Use the original image path without compression
files = {
    "image_file": open(original_image_path, 'rb')
}

payload = { "image_request": "{}" }

headers = {"Api-Key": os.getenv("AIHUBMIX_API_KEY")}

response = requests.post(url, data=payload, files=files, headers=headers)

print(response.json())