# 🍱 Bento Grid 生成器

基于 Next.js 的 Bento Grid 可视化应用，帮你快速生成简洁、美观的信息卡片。

## 功能特性

- 📝 输入或粘贴任意文本内容，精美的 Bento 卡片片刻送达
- 🧠 基于 Claude 4 / GPT-5-Thinking 的智能提取和可视化
- 🎨 原子化的视觉 prompt 配置，方便 DIY
- 🔄 实时渲染和更新
- 📱 响应式设计，适配各种设备

## 快速开始

### 首次安装

确保已安装 Node.js v16.8.0 或更高版本，然后运行：

```bash
# 安装依赖
npm install
```

### 配置环境变量

将项目根目录的 `.env.example` 改名为 `.env.local` 文件，填入以下内容：

```
AIHUBMIX_API_KEY=your_aihubmix_api_key
```

将 `your_aihubmix_api_key` 替换为你在 [AiHubMix](https://aihubmix.com) 获取的 API 密钥。

### 启动开发服务器

```bash
cd bento_card_artifacts/bento-next-app
npm run dev
```

浏览器中访问，即可开始使用。地址一般是 [http://localhost:3000](http://localhost:3000) 

## 使用说明

1. 在首页文本框中输入或粘贴内容
2. 点击「生成」按钮
3. 等待生成完成，将自动跳转到 Bento Grid 展示页面
4. 可以随时返回首页生成新的 Bento Grid

## Tips
- Claude 有一定的概率使用错误的图标引用，这种情况下系统会回退到默认图标 { BadgeInfo }，你可以更换成其他图标
- 如果你希望生成的卡片包含大标题，可以在 SystemPrompt 组件的 JSON 结构中插入一个字段 `"h1": true,`
- 输出材料的语言受 `"lang_output": "same as user query, 中文 as default"` 影响

## 技术栈

- [Next.js 14](https://nextjs.org/) - React 框架
- [Tailwind CSS 3.4.17](https://tailwindcss.com/) - 样式框架
- [Lucide React](https://lucide.dev/) - 图标库
- [AiHubMix API](https://aihubmix.com) - LLM 接口，配备了 Claude 4 和 GPT-5

## API 路由

- `/api/generate-bento` - 生成 Bento Grid
- `/api/bento-status` - 查询 Bento Grid 生成状态

## 文件结构

```
inferHub/bento_card_artifacts/bento-next-app/
├── app/ - Next.js App Router
│   ├── api/ - API 路由
│   ├── bento-view/ - Bento Grid 展示页面
│   └── page.jsx - 首页
├── components/ - React 组件
│   └── SystemPrompt.ts 系统提示词组件
│   ├── BentoGrid.jsx - 生成的 Bento Grid 组件（每次覆盖）
│   └── DefaultBentoGrid.jsx - 默认的示例 Bento Grid
│   └── BentoGrid_goodCase.jsx - 补充的示例
└── ...
```

## 局限性

- LLM 生成的代码如果包括逻辑错误，无法触发边界容错，这种情况下需要重新生成。
- 为了让 LLM 有更大的自由度，整体设计会允许一定的瑕疵出现，比如色彩搭配不那么理想。

## Todo

- [x] 移除时间戳插入，不破坏 bento 卡片页面的解析
- [x] 扩展模型选择，支持 GPT-5
- [x] 支持导出图片
- [ ] 导出图片进一步优化，更准确，更简洁
- [] 支持链接
- [] 支持文件