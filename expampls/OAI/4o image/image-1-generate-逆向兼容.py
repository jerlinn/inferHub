from openai import OpenAI
import os
import requests

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

prompt = """
redesign poster of the movie [Black Swam], 3D cartoon, smooth render, bright tone, 2:3
"""

result = client.images.generate(
    model="gpt-4o-image-vip",
    prompt=prompt,
    n=1, # 单次数量
    size="1024x1536", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default)
    #quality="high" # 逆向模型不能传质量参数，模型捆绑了 📍
)

print(result) # 打印完整的 API 响应，逆向接口不支持 usage 📍

# 定义文件名前缀和保存目录
output_dir = "." # 可以指定其他目录
file_prefix = "image_gen-逆向"

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 遍历所有返回的图片数据，逆向接口的结果是链接 📍
for i, image_data in enumerate(result.data):
    image_url = image_data.url # 获取图片 URL
    if image_url: # 检查 URL 是否存在
        try:
            # 下载图片内容
            response = requests.get(image_url, stream=True)
            response.raise_for_status() # 检查请求是否成功

            image_bytes = response.content # 获取图片字节

            # --- 文件名冲突处理逻辑 ---
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

            # 使用找到的唯一 file_path 保存图片到文件
            with open(file_path, "wb") as f:
                f.write(image_bytes)
            print(f"图片已保存至：{file_path}")

        except requests.exceptions.RequestException as e:
            print(f"下载第 {i} 张图片失败：{e}")
        except Exception as e:
            print(f"处理第 {i} 张图片时发生错误：{e}")

    else:
        # 如果 URL 也不存在，则提示
        print(f"第 {i} 张图片数据中既无 b64_json 也无 url，跳过保存。")