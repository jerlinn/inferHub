import os
import time
from google import genai
from google.genai import types

def load_image(path):
    with open(path, "rb") as image_file:
        return image_file.read()
    
client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"),  # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"},
)

operation = client.models.generate_videos(
    model="veo-2.0-generate-001",
    prompt="The waves in the background keep flowing",
    image=types.Image(
        mime_type="image/png", 
        image_bytes=load_image("img/inferbanner.png")  # 使用你的图片路径
    ),
    config=types.GenerateVideosConfig(
        person_generation="dont_allow",
        aspect_ratio="16:9",
        numberOfVideos=1,
        durationSeconds=5,
    ),
)

while not operation.done:
    time.sleep(20)
    operation = client.operations.get(operation)

for n, generated_video in enumerate(operation.response.generated_videos):
    client.files.download(file=generated_video.video)
    generated_video.video.save(f"video{n}.mp4")