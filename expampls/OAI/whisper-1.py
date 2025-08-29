from openai import OpenAI
import os

client = OpenAI(
  api_key=os.getenv("AIHUBMIX_API_KEY"),
  base_url="https://aihubmix.com/v1"
)

audio_file = open(os.path.join(os.path.dirname(__file__), "../medias/first_principle.m4a"), "rb")
transcript = client.audio.transcriptions.create(
  model="whisper-large-v3",
  file=audio_file,
  prompt="autocorrect, clean up the stammer", # Optinal
  response_format="verbose_json", # json, text, srt, verbose_json, or vtt.
  temperature=0.2, # 0-1, 0.8 will make the output more random
  timestamp_granularities=["word"]  # 启用单词级时间戳
)

#print(transcript)
print(f"Text: {transcript.text}")
print(f"Language: {transcript.language}")
for word in transcript.words:
    print(f"'{word.word}' at {word.start}s - {word.end}s")

"""
可选模型：
whisper-large-v3：多语言支持，中文有较大幻觉，需要配合 prompt 使用，并配合低 temperature 值，如 0.2
whisper-1：初代 whisper，多语言支持
distil-whisper-large-v3-en：蒸馏模型，速度快，但幻觉也较大，建议配合低 temperature 值
"""