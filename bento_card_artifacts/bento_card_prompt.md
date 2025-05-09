# System prompt for Claude/v0 Chat Project

## Prompt:
```
extract the [content], design a bento grid page.

Follow the design atom:
{
  "form": "react",
  "content": "Friendly infographic. Focus on keywords + concise takeaway points. NO [Emoji, long sentence]",
  "style": "Apple Inc. Bright tone",
  "layout": "Tightly-packed bento grid with complete coverage (NO empty spaces), flexible block merging, perfect rectangular composition, and a visually dominant core block, limit the total number of blocks to 6-9",
  "icon": "lucide_react",
  "color": "tailwind",
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
  "output_language": "SAME as user query"
}

Note:
1. Insert spaces on both sides of numbers.
2. Ensure the entire layout fits within a single screen (max 100vh). Avoid vertical overflow. Cap card height, compress layout density. 
3. IMPORTANT FOR GRID LAYOUT: Use grid-cols-12 or grid-cols-6 as base. ALWAYS ensure each card has appropriate col-span-x to completely fill each row. If a row has only one card, that card MUST have col-span-12 (or full width).
4. If URL in the content, add internal link to the appropriate card.`
```

## Quick start in App/Web:

该提示词用于 [Claude](https://claude.ai) project 或 [v0 Chat](https://v0.dev/chat)，**这种方式最简单，生成的结果也最美观**；  
bento-next-app 项目主要用于复刻这种方式；  
而 python 脚本则为更轻量的实现——它既不依赖 AI 服务的会员、也不需要编译 jsx 组件，生成的 html 直接能看，唯一的弊端是界面效果会略有损失。  

1. Set your project instructions
    **For Claude:**
    > Note that you need to subscribe to Claude Pro to use this feature.

    ```mermaid
    flowchart LR
        A([Projects]) --> B([New Project])
        B --> C([Set project instructions])
        C --> D([Paste prompt and save])

        style A fill:#f9f9f9,stroke:#333,stroke-width:2px
        style B fill:#f9f9f9,stroke:#333,stroke-width:2px
        style C fill:#f9f9f9,stroke:#333,stroke-width:2px
        style D fill:#f9f9f9,stroke:#333,stroke-width:2px
    ```
    **For v0 Chat:**

    ```mermaid
    flowchart LR
        A([Projects]) --> B([New Project])
        B --> C([Project Settings])
        C --> D([Knowledge])
        D --> E([Project Instructions])
        E --> F([Paste prompt and save])
        style A fill:#f9f9f9,stroke:#333,stroke-width:2px
        style B fill:#f9f9f9,stroke:#333,stroke-width:2px
        style C fill:#f9f9f9,stroke:#333,stroke-width:2px
        style D fill:#f9f9f9,stroke:#333,stroke-width:2px
        style E fill:#f9f9f9,stroke:#333,stroke-width:2px
        style F fill:#f9f9f9,stroke:#333,stroke-width:2px
    ```
2. Input your question/content.
3. Enjoy!