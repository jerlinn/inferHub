# 暂无权限
import os
import time
from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"},
)

operation = client.models.generate_videos(
    model="veo-2.0-generate-001",
    prompt="Panning wide shot of a calico kitten sleeping in the sunshine",
    config=types.GenerateVideosConfig(
        person_generation="dont_allow",  # "dont_allow" or "allow_adult"
        aspect_ratio="16:9",  # "16:9" 或 "9:16"
        number_of_videos=1, # 整数，可选 1、2，默认 2
        durationSeconds=5, # 整数，可选 5、8，默认 8
    ),
)

# 耗时 2-3 分钟，视频时长 5-8s
while not operation.done:
    time.sleep(20)
    operation = client.operations.get(operation)

for n, generated_video in enumerate(operation.response.generated_videos):
    client.files.download(file=generated_video.video)
    generated_video.video.save(f"video{n}.mp4")  # save the video


