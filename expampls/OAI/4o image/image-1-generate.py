from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1"
)

prompt = """一款高级质感的懒人沙发设计，以张开大嘴的可爱食人花头部为灵感，突出萌萌的獠牙，下排牙齿在两侧扶手位置，而不是靠背位置。
红色椅身外表面带明亮的银白色大圆斑点，分布稀疏，类似七星瓢虫。
两侧扶手侧各有一片叶子作为手托延伸，锯齿状叶缘。
头部有一条纤细、呈半圆弧线下垂的带刺藤蔓，末端是一个开启的小巧 LED 灯，有花萼。（类似灯笼鱼结构）
里面躺着一只超萌的 jellycat 小猫。
整体造型圆润饱满，极度软糯 Q 弹，表面具有细腻的天鹅绒布料纹理和高级缝线细节。画面使用柔和摄影棚布光，带有自然扩散阴影，表现材质的光泽和细节。背景为米白色，无杂物干扰。主体居中摆放。整体风格为极简现代家居风，模拟真实产品摄影，具有超写实感和高级拟物设计感。
1:1."""

result = client.images.generate(
    model="gpt-image-1",
    prompt=prompt,
    n=4, # 单次数量，最多 10 张
    size="1024x1024", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default) 
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