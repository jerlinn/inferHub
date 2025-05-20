from openai import OpenAI
import os
import requests
import base64

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

prompt = """
redesign poster of the movie [Black Swam], 3D cartoon, smooth render, bright tone
"""

result = client.images.generate(
    model="gpt-4o-image-vip",
    prompt=prompt,
    n=1, # 单次数量
    size="1024x1024", # 1024x1024 (square), 1536x1024 (3:2 landscape), 1024x1536 (2:3 portrait), auto (default)
    #quality="high" # 逆向模型不能传质量参数，模型捆绑了 📍
)

print(result) # 打印完整的 API 响应，逆向接口不支持 usage 📍

# 定义文件名前缀和保存目录
output_dir = "." # 可以指定其他目录
file_prefix = "image_gen-逆向"

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 遍历所有返回的图片数据
for i, image_data in enumerate(result.data):
    # 优先处理 base64 字符串
    if hasattr(image_data, "b64_json") and image_data.b64_json:
        image_bytes = base64.b64decode(image_data.b64_json)
        current_index = i
        while True:
            file_name = f"{file_prefix}_{current_index}.png"
            file_path = os.path.join(output_dir, file_name)
            if not os.path.exists(file_path):
                break
            current_index += 1
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        print(f"图片已保存至：{file_path} (base64)")
    # 其次处理 url 字段（保留稳健处理，防止兼容接口再变更）
    elif hasattr(image_data, "url") and image_data.url:
        try:
            response = requests.get(image_data.url, stream=True)
            response.raise_for_status()
            image_bytes = response.content
            current_index = i
            while True:
                file_name = f"{file_prefix}_{current_index}.png"
                file_path = os.path.join(output_dir, file_name)
                if not os.path.exists(file_path):
                    break
                current_index += 1
            with open(file_path, "wb") as f:
                f.write(image_bytes)
            print(f"图片已保存至：{file_path} (url)")
        except requests.exceptions.RequestException as e:
            print(f"下载第 {i} 张图片失败：{e}")
        except Exception as e:
            print(f"处理第 {i} 张图片时发生错误：{e}")
    else:
        print(f"第 {i} 张图片数据中既无 b64_json 也无 url，跳过保存。")