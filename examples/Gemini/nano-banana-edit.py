import os
from openai import OpenAI
from PIL import Image
from io import BytesIO
import base64

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"), # 🔑 Replace with your key generated on AiHubMix
    base_url="https://aihubmix.com/v1",
)

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

image_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resources", "logo.png")
if not os.path.exists(image_path):
    raise FileNotFoundError(f"image {image_path} not exists")

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

base64_image = encode_image(image_path)

response = client.chat.completions.create(
    model="gemini-2.5-flash-image-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "extract the logo shape, blend it to a banana on desk scene, isometric angle. pixar 3d",
                },
                {
                    "type": "image_url", 
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },     
            ],
        },
    ],
    modalities=["text", "image"],
    temperature=0.7,
)
try:
    # Print basic response information without base64 data
    print(f"Creation time: {response.created}")
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
                output_dir = os.path.join(os.path.dirname(image_path), "output")
                os.makedirs(output_dir, exist_ok=True)
                output_path = os.path.join(output_dir, "edited_image.jpg")
                image.save(output_path)
                print(f"✅ Image saved to: {output_path}")
            
    else:
        print("No valid multimodal response received, check response structure")
except Exception as e:
    print(f"Error processing response: {str(e)}")