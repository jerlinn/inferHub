from pathlib import Path
from openai import OpenAI
import os

# 创建 OpenAI 客户端，使用 aihubmix 转发
client = OpenAI(
  api_key=os.getenv("AIHUBMIX_API_KEY"),
  base_url="https://aihubmix.com/v1"
)

# 创建音频输出目录
audio_dir = Path(__file__).parent / "audio"
audio_dir.mkdir(exist_ok=True)

speech_file_path = audio_dir / "speech-中.mp3"
with client.audio.speech.with_streaming_response.create(
  extra_headers={"APP-Code":"******"},
  model="gpt-4o-mini-tts",
  voice="alloy",
  instructions="""Play as a Patient Teacher:
- Accent/Affect: Warm, refined, and gently instructive, reminiscent of a friendly art instructor.
- Tone: Calm, encouraging, and articulate, clearly describing each step with patience.
- Pacing: Slow and deliberate, pausing often to allow the listener to follow instructions comfortably.""", # Optional
  input="你好啊，今天心情怎么样？"
) as response:
  response.stream_to_file(speech_file_path)

"""
# 全参数 https://platform.openai.com/docs/api-reference/audio/createSpeech
# spped: The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default. Does not work with gpt-4o-mini-tts.

* alloy 最佳平衡 ✅
* coral 更戏剧性
* nova 干净利落
* sage 年轻、温柔、有节奏
* shimmer 类似 nova，但更平缓
"""