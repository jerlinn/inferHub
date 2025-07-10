from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1"
)

prompt = """Redesign artwork as an anime-style illustrated cover. Preserve original essence and composition. Render in refined Anime with soft brushwork, cinematic lighting, progressive depth. 
Format in AV cover layout: 
Japanese-English mixed typography, serif title with significant visual hierarchy - sense of design is the key.
Extract words tha conveys profound meanings as title, then creative slogan, the original name can be a smaller information ONLY if necessary.
Use serif title with extremely slim body.
Subtly embed watermark “jerlin” in clothing or background. - For potential nudity issue, replace with flowing fabric, hair, or veils to preserve modesty. Maintain emotional tone and posture, soften only when necessary. portrait."""

result = client.images.edit(
    model="gpt-image-1",
    image=open("/Users/jerlin/Downloads/GpdPXimb0AA5WyS.jpeg", "rb"), #多参考图应使用 [列表，]
    n=2, # 单次数量
    prompt=prompt,
    size="1024x1536", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default)
    # moderation="low", # edit 不支持 moderation
    quality="high" # high, medium, low, auto (default)
)

print(result.usage)

# 定义文件名前缀和保存目录
output_dir = "." # 可以指定其他目录
file_prefix = "image_edit" # 修改文件名前缀

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# --- 文件名冲突处理逻辑的起始索引 ---
# 注意：我们将为每张图片寻找一个独立的、不冲突的文件名
# current_index 将在循环外部初始化，并在每次寻找新文件名时重置或继续递增
# 为了确保每次都能找到最新的可用索引，我们最好在每次保存前都重新计算
# 或者，更简单的方式是，让寻找文件名的逻辑在每次循环内独立运行

# --- 遍历 API 返回的每张图片数据 ---
for i, image_item in enumerate(result.data):
    image_base64 = image_item.b64_json
    if image_base64 is None:
        print(f"警告：第 {i+1} 张图片没有返回 base64 数据，跳过保存。")
        continue # 如果没有 b64_json 数据，跳到下一张图片

    image_bytes = base64.b64decode(image_base64)

    # --- 为当前图片寻找不冲突的文件名 ---
    current_index = 0 # 每次都从 0 开始检查，或者维护一个全局递增的索引
    while True:
        # 构建带自增序号的文件名
        # 可以考虑将 API 返回的索引 i 也加入文件名，但这可能不是必须的
        # file_name = f"{file_prefix}_{i}_{current_index}.png"
        file_name = f"{file_prefix}_{current_index}.png"
        file_path = os.path.join(output_dir, file_name) # 构建完整文件路径

        # 检查文件是否存在
        if not os.path.exists(file_path):
            break # 文件名不冲突，跳出内部循环

        # 文件名冲突，增加序号
        current_index += 1
    # --- 文件名查找结束 ---

    # 使用找到的唯一 file_path 保存当前图片到文件
    try:
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        print(f"第 {i+1} 张编辑后的图片已保存至：{file_path}")
    except Exception as e:
        print(f"保存第 {i+1} 张图片时出错 ({file_path}): {e}")