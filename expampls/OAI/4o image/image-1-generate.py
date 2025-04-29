from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1"
)

prompt = """
Redesign [Movie poster Black Swan] as an anime-style illustrated cover. Preserve original essence and composition. Render in refined ghibli Anime with soft brushwork, cinematic lighting, progressive depth. 
Format in AV cover layout: 
Japanese-English mixed typography, serif title with significant visual hierarchy - sense of design is the key.
Extract words tha conveys profound meanings as title, then creative slogan, the original name can be a smaller information ONLY if necessary.
Subtly embed watermark “jer” in clothing or background. - For potential nudity issue, replace with flowing fabric, hair, or veils to preserve modesty. Maintain emotional tone and posture, soften only when necessary. 2:3 portrait.
"""

result = client.images.generate(
    model="gpt-image-1",
    prompt=prompt,
    n=1, # 单次数量，最多 10 张
    size="1024x1536", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default) 
    quality="high", # high, medium, low, auto (default)
    moderation="low", # low, auto (default) 需要升级 openai 包 📍
    background="auto", # transparent, opaque, auto (default)
)
# azure 的 size 参数不支持显示传入 size="auto"，默认即 auto。
print(result.usage)

# 定义文件名前缀和保存目录
output_dir = "." # 可以指定其他目录
file_prefix = "image_gen"

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 遍历所有返回的图片数据
for i, image_data in enumerate(result.data):
    image_base64 = image_data.b64_json
    if image_base64: # 确保 b64_json 不为空
        image_bytes = base64.b64decode(image_base64)

        # --- 文件名冲突处理逻辑开始 ---
        current_index = i
        while True:
            # 构建带自增序号的文件名
            file_name = f"{file_prefix}_{current_index}.png"
            file_path = os.path.join(output_dir, file_name) # 构建完整文件路径

            # 检查文件是否存在
            if not os.path.exists(file_path):
                break # 文件名不冲突，跳出循环

            # 文件名冲突，增加序号
            current_index += 1
        # --- 文件名冲突处理逻辑结束 ---

        # 使用找到的唯一 file_path 保存图片到文件
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        print(f"图片已保存至：{file_path}")
    else:
        print(f"第 {i} 张图片数据为空，跳过保存。")

# # 原来的保存单张图片的代码
# image_base64 = result.data[0].b64_json
# image_bytes = base64.b64decode(image_base64)
#
# # Save the image to a file
# with open("vinus.png", "wb") as f:
#     f.write(image_bytes)