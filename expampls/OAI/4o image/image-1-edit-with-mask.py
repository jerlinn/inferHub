from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1"
)

prompt = """Keep the scene in photorealistic - while converting [the girl] in style of ghibli anime, Preserve original essence, composition emotional tone, Render in refined Anime with soft brushwork, enhance volumetric lighting. sweet summer. 2:3 portrait."""

result = client.images.edit(
    model="gpt-image-1",
    image=open("/Users/jerlin/Downloads/4oInpaint.jpg", "rb"), #多参考图应使用 [列表，]
    n=1, # 单次数量
    prompt=prompt,
    #mask=open("/Users/jerlin/Downloads/msk2.png", "rb"), # 遮罩图，inpainting 部分是要挖空的，和常用的逻辑完全相反，用抠图工具还要反转
    size="1024x1536", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default)
    # moderation="low", # edit 不支持 moderation
    quality="high" # high, medium, low, auto (default)
)

print(result.usage)

# 定义文件名前缀和保存目录
output_dir = "output"
file_prefix = "image_edit" # 修改文件名前缀

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 为每张图片寻找一个独立的、不冲突的文件名
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
        file_name = f"{file_prefix}_{current_index}.png"
        file_path = os.path.join(output_dir, file_name) # 构建完整文件路径

        # 检查文件是否存在
        if not os.path.exists(file_path):
            break # 文件名不冲突，跳出内部循环

        # 文件名冲突，增加序号
        current_index += 1

    # 使用找到的唯一 file_path 保存当前图片到文件
    try:
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        print(f"第 {i+1} 张编辑后的图片已保存至：{file_path}")
    except Exception as e:
        print(f"保存第 {i+1} 张图片时出错 ({file_path}): {e}")

# --- 循环结束 ---

# (旧的单文件保存逻辑已被移除)