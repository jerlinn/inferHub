import requests
import os
from PIL import Image
import io
import json

# https://x.com/intent/follow?screen_name=eviljer
# Get Key: https://aihubmix.com?aff=m6tE

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

def compress_image(image_path, max_size_mb=1, max_dimension=1024):
    # Open the image
    img = Image.open(image_path)
    
    # Convert to RGB if image is in RGBA mode
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    # Resize if any dimension is larger than max_dimension
    if max(img.size) > max_dimension:
        # Calculate new dimensions maintaining aspect ratio
        ratio = max_dimension / max(img.size)
        new_size = tuple(int(dim * ratio) for dim in img.size)
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Initial quality
    quality = 85
    output = io.BytesIO()
    
    # Compress image until it's under max_size_mb
    while True:
        output.seek(0)
        output.truncate(0)
        img.save(output, format='JPEG', quality=quality)
        size_mb = len(output.getvalue()) / (1024 * 1024)  # Convert to MB
        
        if size_mb <= max_size_mb or quality <= 5:
            break
            
        quality -= 5
    
    output.seek(0)
    return output

url = "https://aihubmix.com/ideogram/remix"

# Prepare image path
image_path = os.path.join(script_dir, 'img', 'panda-jerlin.png')

# Compress image before sending
compressed_image = compress_image(image_path)
files = {
    "image_file": ("image.jpg", compressed_image, "image/jpeg")
}

payload = {
    "image_request": '''{
    "prompt": "red panda in the snow, in the style of watercolor",
    "aspect_ratio": "ASPECT_1_1",
    "image_weight": 80,
    "magic_prompt_option": "ON",
    "model": "V_2"
}'''}

headers = {"Api-Key": os.getenv("AIHUBMIX_API_KEY")}

try:
    response = requests.post(url, data=payload, files=files, headers=headers)
    if response.ok:
        result = response.json()
        # Pretty print the JSON response with indentation
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error: {str(e)}")
finally:
    compressed_image.close()