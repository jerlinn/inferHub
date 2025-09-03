from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

# Define function tools
tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
              "location": {
                  "type": "string",
                  "description": "The city and state, e.g. San Francisco, CA",
              },
              "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
          },
          "required": ["location", "unit"],
        }
    },
    {
        "type": "function",
        "name": "analyze_image",
        "description": "Analyze and describe what's in an image",
        "parameters": {
          "type": "object",
          "properties": {
              "image_description": {
                  "type": "string",
                  "description": "Description of what the image contains",
              },
          },
          "required": ["image_description"],
        }
    }
]

# Example 1: GPT-5 series with text input and functions
print("=== Example 1: GPT-5 with Functions ===")
response1 = client.responses.create(
    model="gpt-5-chat-latest", # gpt-5, gpt-5-chat-latest, gpt-5-mini, gpt-5-nano
    tools=tools,
    input="What is the weather like in San Francisco today? Use celsius.",
    tool_choice="auto",
    # reasoning={ "effort": "minimal" },
      # 推理深度 - Controls how many reasoning tokens the model generates before producing a response. value can be "minimal", "medium", "high", default is "medium"
      # minimal 仅在 gpt-5 系列支持
    text={"verbosity": "medium"},
      # 输出篇幅 - Verbosity determines how many output tokens are generated. value can be "low", "medium", "high", Models before GPT-5 have used medium verbosity by default. 
      # gpt-5-chat-latest 仅支持 medium
)
print(response1)
print()

# Example 2: GPT-5 series with image input
print("=== Example 2: GPT-5 with Image Input ===")
response2 = client.responses.create(
    model="gpt-5-chat-latest",
    input=[
        {
            "role": "user",
            "content": [
                { "type": "input_text", "text": "请详细分析这张图片内容，并用中文回答。Output format: Markdown" },
                {
                    "type": "input_image",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    #"detail": "low"
                }
            ]
        }
    ],
    text={"verbosity": "medium"}
)
print(response2)
print()

# Example 3: GPT-5 series with both image input and functions
print("=== Example 3: GPT-5 with Image + Functions ===")
response3 = client.responses.create(
    model="gpt-5-chat-latest",
    tools=tools,
    input=[
        {
            "role": "user",
            "content": [
                { 
                    "type": "input_text", 
                    "text": "请分析这张图片，然后告诉我图片拍摄地点的天气情况。如果你需要天气信息，请使用提供的工具。Output format: Markdown" 
                },
                {
                    "type": "input_image",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                }
            ]
        }
    ],
    tool_choice="auto",
    text={"verbosity": "medium"}
)
print(response3)
print()

# Example 4: Pure text with GPT-5 reasoning
print("=== Example 4: GPT-5 Pure Text with Reasoning ===")
response4 = client.responses.create(
    model="gpt-5-chat-latest",
    input="塔罗占卜为何有效，背后的原理和可迁移的方法是什么？请深入分析心理学和认知科学角度。Output format: Markdown",
    reasoning={ "effort": "high" },  # 使用更深入的推理
    text={"verbosity": "high"}  # 详细输出
)
print(response4)
print()

# Streaming example (commented out by default)
# print("=== Example 5: Streaming Response ===")
# stream_response = client.responses.create(
#     model="gpt-5-chat-latest",
#     input="请简要介绍人工智能的发展历程",
#     text={"verbosity": "medium"},
#     stream=True
# )
# 
# for event in stream_response:
#     print(event, end="", flush=True)