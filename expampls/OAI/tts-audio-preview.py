import base64
from openai import OpenAI
import os
from pathlib import Path

# 创建音频输出目录
audio_dir = Path(__file__).parent / "audio"
audio_dir.mkdir(exist_ok=True)

client = OpenAI(
  api_key=os.getenv("AIHUBMIX_API_KEY"),
  base_url="https://aihubmix.com/v1"
)

completion = client.chat.completions.create(
    model="gpt-4o-audio-preview",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": "Is a golden retriever a good family dog?"
        }
    ]
)

print(completion.choices[0])

wav_bytes = base64.b64decode(completion.choices[0].message.audio.data)
audio_file_path = audio_dir / "dog.wav"
with open(audio_file_path, "wb") as f:
    f.write(wav_bytes)