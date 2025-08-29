from google import genai
from google.genai import types
import requests
import pathlib
import time
import os

client = genai.Client(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    http_options={"base_url": "https://aihubmix.com/gemini"}
)

# 下载示例视频文件
url = 'https://storage.googleapis.com/generativeai-downloads/data/SherlockJr._10min.mp4'
path_to_video_file = pathlib.Path('SherlockJr._10min.mp4')
if not path_to_video_file.exists():
    with path_to_video_file.open('wb') as wf:
        response = requests.get(url, stream=True)
        for chunk in response.iter_content(chunk_size=32768):
            wf.write(chunk)

# 使用 Files API 上传视频
video_file = client.files.upload(file=path_to_video_file)

# 等待文件处理完成
while video_file.state.name == 'PROCESSING':
    print('等待视频处理中...')
    time.sleep(2)
    video_file = client.files.get(name=video_file.name)

print(f'视频处理完成：{video_file.uri}')

# 创建缓存（5 分钟 TTL）
cache = client.caches.create(
    model="gemini-2.0-flash-001",
    config=types.CreateCachedContentConfig(
        display_name='sherlock jr movie',
        system_instruction=(
            'You are an expert video analyzer, and your job is to answer '
            'the user\'s query based on the video file you have access to.'
        ),
        contents=[video_file],
        ttl="300s",
    )
)

# 使用缓存生成内容
response = client.models.generate_content(
    model="gemini-2.0-flash-001",
    contents=(
        'Introduce different characters in the movie by describing '
        'their personality, looks, and names. Also list the timestamps '
        'they were introduced for the first time.'
    ),
    config=types.GenerateContentConfig(cached_content=cache.name)
)

print(f"Token 使用情况：{response.usage_metadata}")
print(response.text)