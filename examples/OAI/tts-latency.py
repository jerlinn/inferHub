#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import time
from pathlib import Path
from statistics import mean
from openai import OpenAI
import replicate

# 配置 OpenAI 客户端（通过 aihubmix 转发）
client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

# 测试文本
TEST_TEXT = "amazing"

def measure_openai_tts(runs=3):
    delays = []
    for i in range(1, runs + 1):
        start = time.monotonic()
        speech_file = Path(f"openai_tts_{i}.mp3")
        with client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice="alloy",
            instructions="""Play as a Patient Teacher:
- Accent/Affect: Warm, refined, and gently instructive, reminiscent of a friendly art instructor.
- Tone: Calm, encouraging, and articulate, clearly describing each step with patience.
- Pacing: Slow and deliberate, pausing often to allow the listener to follow instructions comfortably.""",
            input=TEST_TEXT
        ) as response:
            response.stream_to_file(speech_file)
        end = time.monotonic()
        delay = end - start
        delays.append(delay)
        print(f"OpenAI TTS 第{i}次延迟：{delay:.3f} 秒")
    return delays

def measure_replicate_tts(runs=3):
    delays = []
    for i in range(1, runs + 1):
        start = time.monotonic()
        output = replicate.run(
            "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
            input={
                "text": TEST_TEXT,
                "speed": 1,
                "voice": "af_bella"
            }
        )
        # 假设 replicate.run 完成即已获取音频 URL 或数据
        end = time.monotonic()
        delay = end - start
        delays.append(delay)
        print(f"Replicate TTS 第{i}次延迟：{delay:.3f} 秒")
    return delays

def summarize(delays, label):
    print(f"\n{label} 延迟统计：")
    print(f"  最小：{min(delays):.3f} 秒")
    print(f"  最大：{max(delays):.3f} 秒")
    print(f"  平均：{mean(delays):.3f} 秒")

def main():
    print("开始测量 OpenAI TTS 延迟…")
    openai_delays = measure_openai_tts()
    summarize(openai_delays, "OpenAI TTS")

    print("\n开始测量 Replicate TTS 延迟…")
    replicate_delays = measure_replicate_tts()
    summarize(replicate_delays, "Replicate TTS")

if __name__ == "__main__":
    main()

"""
## 一句话 "The quick brown fox jumped over the lazy dog."
OpenAI TTS 延迟：
OpenAI TTS 第 1 次延迟：2.182 秒
OpenAI TTS 第 2 次延迟：1.510 秒
OpenAI TTS 第 3 次延迟：1.446 秒

OpenAI TTS 延迟统计：
  最小：1.446 秒
  最大：2.182 秒
  平均：1.713 秒

Replicate TTS 延迟：
Replicate TTS 第 1 次延迟：2.537 秒
Replicate TTS 第 2 次延迟：2.419 秒
Replicate TTS 第 3 次延迟：2.915 秒

Replicate TTS 延迟统计：
  最小：2.419 秒
  最大：2.915 秒
  平均：2.623 秒

## 一个单词 "amazing"
OpenAI TTS 延迟：
OpenAI TTS 第 1 次延迟：1.445 秒
OpenAI TTS 第 2 次延迟：0.661 秒
OpenAI TTS 第 3 次延迟：0.788 秒

OpenAI TTS 延迟统计：
  最小：0.661 秒
  最大：1.445 秒
  平均：0.965 秒

Replicate TTS 延迟：
Replicate TTS 第 1 次延迟：2.980 秒
Replicate TTS 第 2 次延迟：2.440 秒
Replicate TTS 第 3 次延迟：1.932 秒

Replicate TTS 延迟统计：
  最小：1.932 秒
  最大：2.980 秒
  平均：2.451 秒
"""