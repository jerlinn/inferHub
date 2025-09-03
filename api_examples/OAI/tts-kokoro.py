import replicate
import requests
import os
from datetime import datetime

# replicate 包会自动从环境变量 REPLICATE_API_TOKEN 中读取API密钥
# export REPLICATE_API_TOKEN=***

output = replicate.run(
    "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
    input={
        "text": "The quick brown fox jumped over the lazy dog.",
        "speed": 1,
        "voice": "af_bella"
    }
)

print(f"Generated audio URL: {output}")

# 确保audio文件夹存在
audio_dir = os.path.join(os.path.dirname(__file__), "audio")
os.makedirs(audio_dir, exist_ok=True)

# 下载音频文件
if output and isinstance(output, str):
    try:
        response = requests.get(output)
        response.raise_for_status()
        
        # 生成文件名：kokoro + 时间戳
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"kokoro_{timestamp}.wav"
        filepath = os.path.join(audio_dir, filename)
        
        # 保存文件
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        print(f"Audio saved to: {filepath}")
        
    except Exception as e:
        print(f"Error downloading audio: {e}")
else:
    print("No valid audio URL received")