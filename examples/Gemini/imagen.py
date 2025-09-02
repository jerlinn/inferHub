import os
import time
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"},
)

# 目前只支持英文 prompt，绘制大量文本的表现较差
response = client.models.generate_images(
    model="imagen-4.0-generate-001", # imagen-4.0-ultra-generate-001, imagen-4.0-generate-001, imagen-4.0-fast-generate-001, imagen-4.0-fast-generate-preview-06-06, imagen-4.0-generate-preview-05-20、imagen-3.0-generate-002、imagen-4.0-ultra-generate-exp-05-20, imagen-4.0-generate-preview-06-06, imagen-4.0-ultra-generate-preview-06-06
    prompt="Asuka with skintight fighting suit, in beautiful scene. low angle, dynamic lighting, female gesture, dynamic pose, delicate detailed, isometric 3d",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="16:9", # supports "1:1", "9:16", "16:9", "3:4", or "4:3".
        person_generation="allow_adult"
    )
)

script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, "output")

os.makedirs(output_dir, exist_ok=True)

# 生成时间戳作为文件名前缀，避免文件名冲突
timestamp = int(time.time())

# 保存并显示生成的图片
if response and hasattr(response, 'generated_images') and response.generated_images:
    for i, generated_image in enumerate(response.generated_images):
        try:
            image = Image.open(BytesIO(generated_image.image.image_bytes))
            image.show()
            
            file_name = f"imagen3_{timestamp}_{i+1}.png"
            file_path = os.path.join(output_dir, file_name)
            image.save(file_path)
            
            print(f"Image saved to: {file_path}")
        except Exception as e:
            print(f"Error processing image {i+1}: {e}")
else:
    print("Error: No valid image response received")
    print(f"Response type: {type(response)}")
    if response:
        print(f"Response attributes: {dir(response)}")
        if hasattr(response, 'generated_images'):
            print(f"generated_images value: {response.generated_images}")
    else:
        print("Response is empty, please check API key and network connection")