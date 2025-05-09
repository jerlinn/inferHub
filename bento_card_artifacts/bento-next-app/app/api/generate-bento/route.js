import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { BENTO_SYSTEM_PROMPT } from '../../../components/SystemPrompt'

// Claude API 调用
async function generateBentoWithClaudeStream(content, onProgress) {
  try {
    // 读取环境变量中的 API 密钥
    const apiKey = process.env.AIHUBMIX_API_KEY
    
    if (!apiKey) {
      throw new Error("API密钥未配置，请设置 AIHUBMIX_API_KEY 环境变量")
    }
    
    const systemPrompt = BENTO_SYSTEM_PROMPT
    
    // 调用 Claude API，使用流式响应
    const response = await fetch('https://aihubmix.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 6144,
        stream: true,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'text', text: content }
            ]
          }
        ]
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`API 请求失败: ${response.status}${errorText ? ' - ' + errorText : ''}`)
    }
    
    // 读取流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''
    let jsxCodeStarted = false
    let jsxContent = ''
    
    console.log("开始接收 Claude 流式响应...")
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      // 解码二进制数据为文本
      const chunk = decoder.decode(value, { stream: true })
      
      // 处理每个数据块
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (!line.trim() || line.includes('event:')) continue
        
        try {
          // 提取数据
          const dataMatch = line.match(/data: (.+)/)
          if (!dataMatch) continue
          
          const data = JSON.parse(dataMatch[1])
          
          if (data.type === 'content_block_delta' && 
              data.delta && 
              data.delta.type === 'text_delta' && 
              data.delta.text) {
            
            // 直接打印每个文本块，便于调试
            console.log(data.delta.text)
            
            // 追加到完整响应
            fullResponse += data.delta.text
            
            // 触发进度回调
            if (onProgress) {
              onProgress(data.delta.text)
            }
            
            // 检测 JSX 代码块的开始和结束
            if (data.delta.text.includes('```jsx')) {
              jsxCodeStarted = true
            } else if (jsxCodeStarted) {
              if (data.delta.text.includes('```')) {
                jsxCodeStarted = false
              } else {
                jsxContent += data.delta.text
              }
            }
          }
        } catch (e) {
          console.warn('解析流式响应数据块失败:', e)
        }
      }
    }
    
    console.log("Claude 完整响应收集完毕，长度:", fullResponse.length)
    
    // 如果在流式处理中已提取 JSX 代码，直接使用
    if (jsxContent.trim()) {
      // 确保代码以 'use client' 开头
      if (!jsxContent.trim().startsWith("'use client'")) {
        jsxContent = "'use client'\n\n" + jsxContent
      }
      return validateAndFixJSX(jsxContent)
    }
    
    // 如果流式处理未提取到代码，尝试从完整响应中提取
    // 以下使用现有的提取逻辑...
    
    // 提取 JSX 代码 - 使用更宽松的匹配方式
    jsxContent = null
    
    // 如果响应本身就是代码块开头，直接使用整个响应
    if (fullResponse.trim().startsWith("```jsx")) {
      const match = fullResponse.match(/```jsx\s*([\s\S]*?)```/)
      if (match && match[1]) {
        jsxContent = match[1]
      }
    }
    
    // 如果上面的方法失败，尝试更宽松的提取方式
    if (!jsxContent) {
      // 提取所有 'use client' 开头的代码段
      const clientComponentMatch = fullResponse.match(/'use client'[\s\S]*?export default function/)
      if (clientComponentMatch) {
        // 从匹配点开始一直到响应结束
        const startIdx = fullResponse.indexOf(clientComponentMatch[0])
        jsxContent = fullResponse.substring(startIdx)
        
        // 如果结尾有 ``` 或其他非代码部分，移除它
        const endCodeBlockIdx = jsxContent.lastIndexOf("```")
        if (endCodeBlockIdx !== -1) {
          jsxContent = jsxContent.substring(0, endCodeBlockIdx).trim()
        }
      }
    }
    
    // 仍然失败，尝试直接提取完整的 React 组件
    if (!jsxContent) {
      const componentMatch = fullResponse.match(/import[\s\S]*?export default function[\s\S]*?\}/)
      if (componentMatch) {
        jsxContent = componentMatch[0]
      }
    }
    
    // 最后尝试：如果找到了代码块但没有正确提取，使用手动方式
    if (!jsxContent && fullResponse.includes("```jsx")) {
      // 找到第一个 ```jsx 后的内容
      const startIdx = fullResponse.indexOf("```jsx") + "```jsx".length
      // 找到最后一个 ``` 的位置
      const endIdx = fullResponse.lastIndexOf("```")
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        jsxContent = fullResponse.substring(startIdx, endIdx).trim()
      }
    }
    
    // 如果提取的内容不以 'use client' 开头，添加它
    if (jsxContent && !jsxContent.trim().startsWith("'use client'")) {
      jsxContent = "'use client'\n\n" + jsxContent
    }
    
    if (!jsxContent) {
      // 如果仍然无法提取，直接使用响应体创建一个基本组件
      console.log("无法提取JSX代码，将使用整个响应体创建基本组件")
      jsxContent = createComponentFromResponse(fullResponse)
    }
    
    // 验证和修复 JSX 内容
    jsxContent = validateAndFixJSX(jsxContent)
    
    // 打印提取的JSX内容
    console.log("提取的JSX代码:", jsxContent)
    
    return jsxContent
    
  } catch (error) {
    console.error("调用Claude API生成Bento Grid失败:", error)
    throw error
  }
}

// 验证和修复 JSX 代码，特别是 SafeIcon 组件的使用
function validateAndFixJSX(jsxContent) {
  // 检查是否有未完成的 SafeIcon 调用
  const incompleteIconRegex = /<SafeIcon\s+icon(?!\s*=)/g;
  const incompleteIconMatches = jsxContent.match(incompleteIconRegex);
  
  if (incompleteIconMatches) {
    console.warn(`检测到 ${incompleteIconMatches.length} 个不完整的 SafeIcon 调用，尝试修复...`);
    
    // 修复未完成的 SafeIcon 调用，使用 BadgeInfo 作为默认图标
    jsxContent = jsxContent.replace(incompleteIconRegex, '<SafeIcon icon={BadgeInfo}');
  }
  
  // 检查是否有未正确关闭的 JSX 标签
  const openDivRegex = /<div[^>]*>(?![\s\S]*?<\/div>)/g;
  const openDivMatches = jsxContent.match(openDivRegex);
  
  if (openDivMatches) {
    console.warn(`检测到 ${openDivMatches.length} 个未关闭的 div 标签，尝试修复...`);
    // 为简单起见，我们只检测未关闭的情况，但不尝试修复（这需要更复杂的解析）
    // 这里我们只添加一个警告日志，后面通过 ErrorBoundary 捕获渲染错误
  }
  
  // 确保导入 BadgeInfo
  if (!jsxContent.includes('BadgeInfo') && jsxContent.includes('lucide-react')) {
    // 查找 import 语句
    const importMatch = jsxContent.match(/import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/);
    if (importMatch) {
      const existingImports = importMatch[1];
      const newImport = existingImports.includes('BadgeInfo') 
        ? existingImports 
        : `${existingImports}, BadgeInfo`;
      
      jsxContent = jsxContent.replace(
        /import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/,
        `import {${newImport}} from 'lucide-react'`
      );
    }
  }
  
  // 移除任何不必要的CSS导入，特别是Space Grotesk相关的CSS
  jsxContent = jsxContent.replace(/import\s+['"]\.\/space-grotesk\.css['"]\s*\n/g, '');
  jsxContent = jsxContent.replace(/import\s+['"]\.\/fonts\.css['"]\s*\n/g, '');
  
  // 移除重复的'use client'声明
  let useClientCount = 0;
  jsxContent = jsxContent.replace(/(['"])use client\1\s*\n/g, match => {
    useClientCount++;
    return useClientCount === 1 ? match : '';
  });
  
  // 如果有使用font-space-grotesk类名或其他字体类，替换为内联样式
  jsxContent = jsxContent.replace(
    /className="([^"]*)font-space-grotesk([^"]*)"/g, 
    'className="$1$2" style={{ fontFamily: "\'Space Grotesk\', sans-serif" }}'
  );
  
  // 如果div已经有style，但需要添加字体样式
  jsxContent = jsxContent.replace(
    /className="([^"]*)font-space-grotesk([^"]*)"\s+style={{([^}]*)}}/g,
    'className="$1$2" style={{ $3, fontFamily: "\'Space Grotesk\', sans-serif" }}'
  );

  return jsxContent;
}

// 根据响应创建一个基本组件
function createComponentFromResponse(responseText) {
  // 创建一个显示原始响应的简单组件
  return `'use client'

import React from 'react';
import { AlertCircle, BadgeInfo } from 'lucide-react';

// 图标安全组件：处理未定义的图标或渲染失败的情况，始终回退到 BadgeInfo
const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  // 检查 Icon 是否未定义
  if (!Icon) {
    console.warn(\`Icon is undefined, using fallback icon\`)
    return <Fallback {...props} />
  }
  
  // 尝试渲染图标，如果失败则使用后备图标
  try {
    return <Icon {...props} />
  } catch (error) {
    console.warn(\`Icon rendering failed, using fallback icon\`, error)
    return <Fallback {...props} />
  }
}

export default function BentoGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-sans">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
        <div className="flex items-start">
          <SafeIcon icon={AlertCircle} className="text-yellow-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-700">
            无法正确解析AI生成的代码，显示原始响应。您可以重新尝试生成。
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 bg-blue-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">AI响应</h2>
          <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded-lg overflow-auto max-h-[500px] border border-gray-100">
            {${JSON.stringify(responseText.replace(/```jsx|```/g, ''))}}
          </pre>
        </div>
      </div>
    </div>
  );
}`
}

// 保存生成的 JSX 到组件文件
function saveBentoGridComponent(jsxContent) {
  const componentsDir = path.join(process.cwd(), 'components')
  const filePath = path.join(componentsDir, 'BentoGrid.jsx')
  
  try {
    // 添加时间戳注释，确保文件内容有变化
    const contentWithTimestamp = `${jsxContent}\n// Generated at: ${new Date().toISOString()}`
    
    // 首先删除文件（如果存在），确保文件系统识别为新文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    // 写入新文件
    fs.writeFileSync(filePath, contentWithTimestamp, 'utf8')
    
    // 标记生成状态
    const statusPath = path.join(process.cwd(), 'components', '.bento-status.json')
    fs.writeFileSync(statusPath, JSON.stringify({ 
      generated: true,
      timestamp: new Date().toISOString()
    }), 'utf8')
    
    return true
  } catch (error) {
    console.error("保存Bento Grid组件失败:", error)
    throw error
  }
}

// 格式化用于流式输出的文本块
function formatStreamChunk(text) {
  // 不做任何截断或格式化处理，直接返回原始文本
  return text;
}

// 节流函数 - 限制高频率事件
function throttle(func, limit) {
  let inThrottle;
  let lastResult;
  let lastTime = 0;
  let textBuffer = '';
  
  return function(...args) {
    const now = Date.now();
    
    // 将文本累积到缓冲区
    if (args[0] && typeof args[0] === 'string') {
      textBuffer += args[0];
      
      // 不过滤过短的文本，每次都尝试发送
      args[0] = textBuffer;
      
      // 只有在达到限流时间后才清空缓冲区
      if (!inThrottle || now - lastTime >= limit) {
        textBuffer = '';
        lastTime = now;
      } else {
        return lastResult;
      }
    }
    
    if (!inThrottle || now - lastTime >= limit) {
      lastResult = func.apply(this, args);
      lastTime = now;
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    
    return lastResult;
  }
}

// 导出 API 处理函数 - 流式响应版本
export async function POST(request) {
  try {
    const { content } = await request.json()
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      )
    }
    
    // 创建一个流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // 创建一个节流版本的发送进度函数，最高频率为每150ms发送一次
        const throttledSend = throttle((text) => {
          // 格式化文本块
          const formattedText = formatStreamChunk(text)
          
          // 如果格式化后为空，则跳过发送
          if (!formattedText) return;
          
          // 创建SSE格式的消息并发送
          const message = `data: ${JSON.stringify({ text: formattedText })}\n\n`
          controller.enqueue(encoder.encode(message))
        }, 150);
        
        // 进度回调函数
        const sendProgress = (text) => {
          try {
            throttledSend(text);
          } catch (error) {
            console.error('发送进度更新失败:', error)
          }
        }
        
        try {
          // 调用Claude API生成Bento Grid
          const jsxContent = await generateBentoWithClaudeStream(content, sendProgress)
          
          // 保存生成的组件
          await saveBentoGridComponent(jsxContent)
          
          // 发送完成消息
          const completionMessage = `data: ${JSON.stringify({ text: '✅ 便当制作完成' })}\n\n`
          controller.enqueue(encoder.encode(completionMessage))
          
          // 完成流式响应
          controller.close()
        } catch (error) {
          // 发送错误消息
          const errorMessage = `data: ${JSON.stringify({ text: `❌ 错误: ${error.message || '生成失败'}` })}\n\n`
          controller.enqueue(encoder.encode(errorMessage))
          controller.close()
        }
      }
    })
    
    // 返回流式响应
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
    
  } catch (error) {
    console.error('处理请求失败:', error)
    return NextResponse.json({ error: error.message || '处理请求失败' }, { status: 500 })
  }
} 