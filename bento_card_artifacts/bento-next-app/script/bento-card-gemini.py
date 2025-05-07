import os
import re
from google import genai
from google.genai import types

content = """Q: 如果说搜索能力是互联网时代的超能力，属于 AI 时代的超能力又是什么
A: 🌌 **AI 时代的超能力：具象化、自动化与洞察的融合**
这个问题，像是在问："如果**Google 是记忆的外挂**，那 AI 是什么？"我们站在时代的断层上，回望搜索的意义：它让**人类第一次能直接访问全球知识图谱**，而现在，AI 正在让"访问"本身过时。
**AI 时代的超能力，不是获取信息，而是**：
**把想法直接转化为可用结果（from intention to instantiation）**。
让我们解剖一下这个超能力的底层结构——它不只是"快"，而是从**主动索取 → 被动推送 → 自动生成 → 联合创造**的质变。它包含三股力量的融合：
1. **语言具象化能力** ——你用自然语言说"我要一个像 Ghibli 风格的城市夜景"，AI 就能画出来。 ——你用模糊、感性的词"想要柔和一点的光感"，它自动优化出符合美学的方案。这是一种**具象化潜意识、模糊意图的能力**，是对"想法 → 作品"之间摩擦的消除。
2. **大规模自动化** AI 不只是处理任务，而是能**多线程、规模化**地并行创造。例如，你要写 50 封客户邮件、测试 100 种广告文案、生成 1 万张数据集图——AI 一夜之间帮你搞定。这是一种**超人的"执行复利"**：每个结果都在你没动手的情况下增长。
3. **洞察力增强（Augmented Insight）** 搜索给你一堆答案，AI 会帮你"拆解、重组、归纳"答案。它让"你还没想到的问题"浮出水面。AI 能扫描海量数据、模式、隐喻、联系，找到**人类直觉看不到的规律**，帮你逆推"为什么"。
如果搜索是"你知道自己不知道什么"，去找答案。 **AI 是"你不知道自己不知道什么"，它替你找到问题本身。**
类比
如果搜索是"你穿着潜水服在海里捞珍珠"，AI 就是"你站在船上，海水自动退去，露出海床上所有珍珠"。它不是工具，而是**环境的改变**。
**搜索赋能"查询者"；AI 赋能"创造者"。**
逆向思考：有什么不是 AI 的超能力？
反过来看——AI 不能替代的是：
* **目的感（why）、选择权（what）、边界感（enough）**
* **价值判断、审美直觉、情绪共鸣**
它给你"什么都能做到"，但**不告诉你"什么值得去做"**。于是，AI 时代最稀缺的，不是技能，而是"会提问、会定义问题的人"。
**AI 让"提问本身"成为超能力的核心入口。**
所以总结一句：
**AI 时代的超能力，是"从语言到具象化的即时创造力" + "规模化自动执行" + "模式洞察和未知发掘"**。但最终，真正罕见的超能力，仍然是：**敢问好问题的人。**"""

system_prompt =  """extract the [content], design a bento page.
Follow the design atom:
{
  "implementation": "html+css",
  "content": "Friendly infographic. Focus on keywords + CONCISE takeaway points. NO [Emoji, long sentence]",
  "style": "Apple Inc. Bright tone",
  "layout": "Tightly-packed bento grid with complete coverage (NO empty spaces), flexible block merging, perfect rectangular composition, and a visually dominant core block, limit the total number of blocks to 6-9",
  "icon": "lucide",
  "palette_system": "Extract a base tone from the content's emotional feel. Build a harmonized palette system using a single hue family. Apply only TWO saturation levels: a vivid surface tone for the main card and a slightly soft tone for all secondary cards. Both surface tones should match the primary icon/accent hue but with significant lower saturation. Maintain the same primary accent color across all cards for icons.",
  "bg": "#fefefe",
  "font": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
  "hierarchy": {
    "highlight_icon_or_number": "48px",
    "body_text": "16px"
  },
  "card_radius": "16px",
  "gap": "16px",
  "core_block_link": "https://x.com/intent/follow?screen_name=eviljer",
  "output_language": "same as user query"
}
lucide usage example:
1. In <head>:
<script src=" https://unpkg.com/lucide@latest"></script>

2. use icon:
.card [data-lucide], 
.card svg {
  width: 48px !important;
  height: 48px !important;
}

<i data-lucide = "rocket" ></i>

3. initial:
<script>
  lucide.createIcons();
</script>
"""

def get_api_key_from_env_file(env_path, key_name="AIHUBMIX_API_KEY"):
    if not os.path.exists(env_path):
        raise FileNotFoundError(f".env.local not found at {env_path}")
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            match = re.match(rf'^{key_name}\s*=\s*["\']?([^"\']+)["\']?', line.strip())
            if match:
                return match.group(1)
    raise ValueError(f"{key_name} not found in {env_path}")

def get_next_available_filename(output_dir, base_name="bento_card_output", ext=".html"):
    os.makedirs(output_dir, exist_ok=True)
    n = 1
    while True:
        filename = f"{base_name}_{n}{ext}"
        full_path = os.path.join(output_dir, filename)
        if not os.path.exists(full_path):
            return full_path
        n += 1

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
api_key = get_api_key_from_env_file(env_path)

# 初始化客户端
client = genai.Client(
    api_key=api_key, # 🔑 从 .env.local 读取
    http_options={"base_url": "https://aihubmix.com/gemini"}
)

model = "gemini-2.5-flash-preview-04-17" #gemini-2.5-flash-preview-04-17、gemini-2.0-flash、gemini-2.5-pro-preview-05-06
contents = [
    types.Content(
        role="user",
        parts=[
            types.Part.from_text(text=system_prompt),
            types.Part.from_text(text=content),
            types.Part.from_text(text="""Note: 
1. Insert spaces on both sides of numbers.
2. Ensure the entire layout fits within a single screen (max 100vh). Avoid vertical overflow. Cap card height, 
compress layout density. For a row containing only one card, automatically expand 
the card to fill the available width without breaking the grid structure or introducing unnecessary padding."""),
        ],
    ),
]
generate_content_config = types.GenerateContentConfig(
    response_mime_type="text/plain",
)

try:
    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )

    html_content = ""

    # 尝试从响应中提取HTML
    if response.candidates and len(response.candidates) > 0 and response.candidates[0].content:
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                # 尝试从文本中提取HTML代码块
                html_match = re.search(r'```html\s*(<!DOCTYPE html>[\s\S]*?)<\/html>[\s\S]*?```', part.text)
                if html_match:
                    html_content = html_match.group(1) + "</html>"
                    break

    # 如果未找到HTML，则显示警告
    if not html_content:
        print("警告：未能从响应中提取HTML")
        html_content = "<!-- 未能从响应中提取有效的HTML内容 -->"

    # 保存HTML
    output_dir = os.path.join(os.path.dirname(__file__), "../html_output")
    output_path = get_next_available_filename(output_dir)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"\n已保存HTML到：{output_path}")
    
except Exception as e:
    print(f"生成内容时出错：{str(e)}")