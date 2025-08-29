import mimetypes
import os
from google import genai
from google.genai import types
import os

""""
费率（输入→输出）：Text: $0.3→$2.5/M tokens; Image: $0.3→$30/M tokens
需要新增参数来体验新特性 "modalities":["text","image"]
图片以 Base64 编码形式传递与输出
输出图片的默认尺寸为 1024*1024px，折合 1290 Tokens
Aihubmix 平台支持 gemini 原生与 OpenAI 兼容则 2 种请求格式
"""

def save_binary_file(file_name, data):
    # 创建 output 目录（如果不存在）
    output_dir = "output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 构建完整的文件路径
    file_path = os.path.join(output_dir, file_name)
    name, ext = os.path.splitext(file_path)
    
    # 检查文件是否存在，如果存在则自动递增
    counter = 0
    final_file_path = file_path
    
    while os.path.exists(final_file_path):
        counter += 1
        final_file_path = f"{name}_{counter}{ext}"
    
    # 保存文件
    with open(final_file_path, "wb") as f:
        f.write(data)
    
    print(f"File saved to: {final_file_path}")
    return final_file_path

def generate():
    client = genai.Client(
        api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 换成你在 AiHubMix 生成的密钥
        http_options={"base_url": "https://aihubmix.com/gemini"},
    )

    model = "gemini-2.5-flash-image-preview"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_bytes(
                    mime_type="image/jpeg",
                    data=open("img/generated_image.jpg", "rb").read(),
                ),
                types.Part.from_text(text="""1"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_modalities=[
            "IMAGE",
            "TEXT",
        ],
    )

    file_index = 0
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            chunk.candidates is None
            or chunk.candidates[0].content is None
            or chunk.candidates[0].content.parts is None
        ):
            continue
        if chunk.candidates[0].content.parts[0].inline_data and chunk.candidates[0].content.parts[0].inline_data.data:
            file_name = f"nano_banana_{file_index}"
            file_index += 1
            inline_data = chunk.candidates[0].content.parts[0].inline_data
            data_buffer = inline_data.data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            save_binary_file(f"{file_name}{file_extension}", data_buffer)
        else:
            print(chunk.text)

if __name__ == "__main__":
    generate()
