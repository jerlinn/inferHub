from openai import OpenAI

client = OpenAI(
    api_key="sk-***", # 🔑 换成你在 AiHubMix 生成的密钥
    base_url="https://aihubmix.com/v1",
)

# 定义工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "获取指定位置的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称，如北京、上海等"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# 创建聊天完成请求，包含工具定义
completion = client.chat.completions.create(
    model="Qwen/Qwen3-30B-A3B", #2.5 和 3 都支持，QwQ 不支持
    messages=[
        {
            "role": "user",
            "content": "北京今天的天气怎么样？"
        }
    ],
    tools=tools,
    tool_choice="auto",  # 让模型自行决定是否使用工具
    stream=True
)

# 用于收集工具调用信息的字典
tool_calls = {}

# 处理流式响应
for chunk in completion:
    if not hasattr(chunk.choices, '__len__') or len(chunk.choices) == 0:
        continue
        
    delta = chunk.choices[0].delta
    
    # 处理文本内容
    if hasattr(delta, 'content') and delta.content:
        print(delta.content, end="")
    
    # 处理工具调用
    if hasattr(delta, 'tool_calls') and delta.tool_calls:
        for tool_call in delta.tool_calls:
            if not hasattr(tool_call, 'index'):
                continue
                
            idx = tool_call.index
            if idx not in tool_calls:
                tool_calls[idx] = {"name": "", "arguments": ""}
                
            if hasattr(tool_call, 'function'):
                if hasattr(tool_call.function, 'name') and tool_call.function.name:
                    tool_calls[idx]["name"] = tool_call.function.name
                if hasattr(tool_call.function, 'arguments') and tool_call.function.arguments:
                    tool_calls[idx]["arguments"] += tool_call.function.arguments

# 完成后，打印收集到的工具调用信息
for idx, info in tool_calls.items():
    if info["name"]:
        print(f"\n工具调用：{info['name']}")
    if info["arguments"]:
        print(f"参数：{info['arguments']}")