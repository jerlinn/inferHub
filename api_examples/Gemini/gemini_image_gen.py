import os
from openai import OpenAI
from PIL import Image
from io import BytesIO
import base64

# https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Image_out.ipynb#scrollTo=OaRYCCC5L6VL

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

# Using text-only input
response = client.chat.completions.create(
    model="gemini-2.5-flash-image-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "generate an adorable mermaid in the ocean castle, bold outline, chibi cartoon, in the style of Children coloring book, title 'sylvia' on top, super cute, B&W, HD", #generate a dressing room with a changing room interior view, it is in a mermaid castle under sea. bold outline, chibi cartoon, in the style of Children coloring book, super cute, B&W, HD, avoid over-complicated
                    # generate an adorable mermaid in the ocean castle, bold outline, chibi cartoon, in the style of Children coloring book, title 'sylvia' on top, super cute, B&W, HD
                }
            ],
        },
    ],
    modalities=["text", "image"],
    temperature=0.8,
)
try:
    # Print basic response information
    print(f"Creation time: {response.created}")
    print(f"Full usage: {response.usage}")
    print(f"Completion: {response.usage.completion_tokens}")
    print(f"Prompt: {response.usage.prompt_tokens}") 
    print(f"Token usage: {response.usage.total_tokens}")

    # Check if multi_mod_content field exists
    if (
        hasattr(response.choices[0].message, "multi_mod_content")
        and response.choices[0].message.multi_mod_content is not None
    ):
        print("\nResponse content:")
        for part in response.choices[0].message.multi_mod_content:
            if "text" in part and part["text"] is not None:
                print(part["text"])
            
            # Process image content
            elif "inline_data" in part and part["inline_data"] is not None:
                print("\n🖼️ [Image content received]")
                image_data = base64.b64decode(part["inline_data"]["data"])
                mime_type = part["inline_data"].get("mime_type", "image/png")
                print(f"Image type: {mime_type}")
                
                image = Image.open(BytesIO(image_data))
                image.show()
                
                # Save image
                output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
                os.makedirs(output_dir, exist_ok=True)
                output_path = os.path.join(output_dir, "generated_image.png")
                image.save(output_path)
                print(f"✅ Image saved to: {output_path}")
            
    else:
        print("No valid multimodal response received, check response structure")
except Exception as e:
    print(f"Error processing response: {str(e)}")