import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { BENTO_SYSTEM_PROMPT } from '../../../components/SystemPrompt'

// GPT-5 API 调用
async function generateBentoWithGPT5Stream(content, onProgress, onStreamingEvent) {
  try {
    const apiKey = process.env.AIHUBMIX_API_KEY
    
    if (!apiKey) {
      throw new Error("API 密钥未配置，请设置 AIHUBMIX_API_KEY 环境变量")
    }
    
    const systemPrompt = BENTO_SYSTEM_PROMPT
    
    // GPT-5 使用 OpenAI 格式的 API
    const response = await fetch('https://aihubmix.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5', //gpt-5-chat-latest
        //max_completion_tokens: 4096,
        stream: true,
        reasoning_effort: 'minimal',  // minimal, low, medium, high - 最小推理努力，最快响应
        verbosity: 'low',             // low, medium, high - 控制输出详细程度
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ]
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`GPT-5 API 请求失败：${response.status}${errorText ? ' - ' + errorText : ''}`)
    }
    
    // 读取流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullResponse = ''
    let jsxCodeStarted = false
    let jsxContent = ''
    let reasoningStarted = false
    let reasoningContent = ''
    let buffer = '' // 用于处理不完整的数据块
    
    console.log("开始接收 GPT-5 流式响应...")
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      
      // 将新数据添加到缓冲区
      buffer += chunk
      
      // 处理完整的行
      const lines = buffer.split('\n')
      // 保留最后一个不完整的行在缓冲区中
      buffer = lines.pop() || ''
      
      // GPT-5 流式响应处理
      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data:')) continue
        
        if (line.includes('data: [DONE]')) break
        
        try {
          const dataStr = line.substring(5).trim()
          if (!dataStr) continue
          
          const data = JSON.parse(dataStr)
          
          // 简化调试：只打印有用信息
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            console.log('GPT-5 Content:', data.choices[0].delta.content)
          }
          
          // 处理推理内容 - 检查多种可能的reasoning字段
          const choice = data.choices && data.choices[0]
          
          // 检查是否有reasoning相关的数据
          let hasReasoningData = false
          
          if (choice && choice.delta) {
            // 处理reasoning delta
            if (choice.delta.reasoning) {
              hasReasoningData = true
              const reasoningText = choice.delta.reasoning
              console.log('推理增量:', reasoningText)
              
              if (onStreamingEvent) {
                onStreamingEvent('response.reasoning_summary.delta', { 
                  delta: { text: reasoningText }
                })
              }
            }
            
            // 处理reasoning summary
            if (choice.delta.reasoning_summary) {
              hasReasoningData = true
              const summaryText = choice.delta.reasoning_summary
              console.log('推理摘要:', summaryText)
              
              if (onStreamingEvent) {
                onStreamingEvent('response.reasoning_summary.delta', { 
                  delta: { text: summaryText }
                })
              }
            }
          }
          
          // 在minimal模式下，可能直接输出content而没有reasoning数据
          if (!hasReasoningData && choice && choice.delta && choice.delta.content) {
            // 在minimal模式下，不发送推理相关的事件，直接进入内容生成
          }
          
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            const deltaText = data.choices[0].delta.content
            
            fullResponse += deltaText
            
            if (onProgress) {
              onProgress(deltaText)
            }
            
            // 检测推理过程（在 JSX 代码之前的内容）
            if (!jsxCodeStarted && !deltaText.includes('```jsx')) {
              if (!reasoningStarted && (deltaText.includes('分析') || deltaText.includes('设计') || deltaText.includes('考虑'))) {
                reasoningStarted = true
                if (onStreamingEvent) {
                  onStreamingEvent('response.reasoning_summary.delta', { 
                    delta: { text: '开始分析Bento Grid布局需求...\n\n' }
                  })
                }
              }
              
              if (reasoningStarted) {
                reasoningContent += deltaText
                if (onStreamingEvent) {
                  onStreamingEvent('response.reasoning_summary.delta', { 
                    delta: { text: deltaText }
                  })
                }
              }
            }
            
            // 检测 JSX 代码块的开始和结束 - 增强版本支持更多格式
            if (deltaText.includes('```jsx') || deltaText.includes('```javascript') || deltaText.includes('```js')) {
              jsxCodeStarted = true
              reasoningStarted = false // 推理结束
              if (onStreamingEvent) {
                onStreamingEvent('response.reasoning_summary.done', { 
                  message: '推理总结完成'
                })
              }
            } else if (jsxCodeStarted) {
              if (deltaText.includes('```')) {
                jsxCodeStarted = false
              } else {
                jsxContent += deltaText
              }
            } else if (!jsxCodeStarted && (deltaText.includes("'use client'") || deltaText.includes('"use client"'))) {
              // 检测直接的组件代码开始（无代码块包装）
              jsxCodeStarted = true
              reasoningStarted = false
              jsxContent += deltaText
              if (onStreamingEvent) {
                onStreamingEvent('response.reasoning_summary.done', { 
                  message: '推理总结完成'
                })
              }
            } else if (jsxCodeStarted && !deltaText.includes('```')) {
              // 继续收集组件代码
              jsxContent += deltaText
            }
          }
        } catch (e) {
          console.warn('解析 GPT-5 流式响应数据块失败：', e)
        }
      }
    }
    
    console.log("GPT-5 完整响应收集完毕，长度：", fullResponse.length)
    
    // 优先使用流式提取的JSX内容，但要验证完整性
    if (jsxContent.trim()) {
      console.log("=== GPT-5 流式提取分析 ===")
      console.log("流式JSX长度:", jsxContent.length)
      console.log("流式JSX预览:", jsxContent.substring(0, 300))
      
      const result = validateAndFixJSX(jsxContent)
      
      // 如果流式提取的内容无效，回退到完整响应提取
      if (result === createSimpleFallback()) {
        console.log("GPT-5 流式JSX验证失败，回退到完整响应提取")
        // 继续执行完整响应提取
      } else {
        console.log("GPT-5 流式提取验证成功，返回结果")
        return result
      }
    } else {
      console.log("GPT-5 流式JSX为空，直接使用完整响应提取")
    }
    
    // 从完整响应中提取 JSX 代码
    console.log("GPT-5 从完整响应提取JSX")
    return extractJSXFromResponse(fullResponse)
    
  } catch (error) {
    console.error("调用 GPT-5 API 生成 Bento Grid 失败：", error)
    throw error
  }
}

// Claude API 调用
async function generateBentoWithClaudeStream(content, onProgress) {
  try {
    // 读取环境变量中的 API 密钥
    const apiKey = process.env.AIHUBMIX_API_KEY
    
    if (!apiKey) {
      throw new Error("API 密钥未配置，请设置 AIHUBMIX_API_KEY 环境变量")
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
        model: 'claude-sonnet-4-20250514', // claude-opus-4-20250514, claude-sonnet-4-20250514
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
      throw new Error(`API 请求失败：${response.status}${errorText ? ' - ' + errorText : ''}`)
    }
    
    // 读取流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullResponse = ''
    let jsxCodeStarted = false
    let jsxContent = ''
    let buffer = '' // 用于处理不完整的数据块
    
    console.log("开始接收 Claude 流式响应...")
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      // 解码二进制数据为文本
      const chunk = decoder.decode(value, { stream: true })
      
      // 将新数据添加到缓冲区
      buffer += chunk
      
      // 处理完整的行
      const lines = buffer.split('\n')
      // 保留最后一个不完整的行在缓冲区中
      buffer = lines.pop() || ''
      
      // 处理每个数据块
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
          console.warn('解析流式响应数据块失败：', e)
        }
      }
    }
    
    console.log("Claude 完整响应收集完毕，长度：", fullResponse.length)
    
    // 优先使用流式提取的JSX内容，但要验证完整性
    if (jsxContent.trim()) {
      console.log("使用流式提取的JSX，长度:", jsxContent.length)
      const result = validateAndFixJSX(jsxContent)
      
      // 如果流式提取的内容无效，回退到完整响应提取
      if (result === createSimpleFallback()) {
        console.log("流式JSX无效，回退到完整响应提取")
      } else {
        return result
      }
    }
    
    // 从完整响应中提取 JSX 代码
    console.log("从完整响应提取JSX")
    return extractJSXFromResponse(fullResponse)
    
  } catch (error) {
    console.error("调用 Claude API 生成 Bento Grid 失败：", error)
    throw error
  }
}

// 从响应中提取 JSX 代码的强化函数
function extractJSXFromResponse(fullResponse) {
  console.log("开始提取 JSX 代码，响应长度:", fullResponse.length)
  console.log("响应前500字符预览:", fullResponse.substring(0, 500))
  
  // GPT-5 推理模式特殊处理：寻找推理结论后的代码
  const reasoningEndMarkers = [
    '最终代码：', '组件代码：', '实现代码：', 'Final code:', 'Component code:', 
    '```jsx', '```javascript', '```js', "'use client'", '"use client"'
  ]
  
  // 优先级0: GPT-5 推理模式 - 寻找推理结论后的代码段
  for (const marker of reasoningEndMarkers) {
    const markerIndex = fullResponse.lastIndexOf(marker)
    if (markerIndex !== -1) {
      let codeSection = fullResponse.substring(markerIndex)
      console.log(`找到标记 "${marker}" 在位置 ${markerIndex}`)
      console.log(`代码段预览: ${codeSection.substring(0, 200)}`)
      
      // 如果找到了代码标记，尝试提取完整的组件代码
      if (marker === "'use client'" || marker === '"use client"') {
        // 如果整个响应就是代码（即 markerIndex 接近0），直接使用整个响应
        if (markerIndex < 50) {
          codeSection = fullResponse.trim()
          console.log(`使用整个响应作为代码，长度: ${codeSection.length}`)
        } else {
          // 否则从标记开始到最后一个 }
          const endIndex = codeSection.lastIndexOf('}')
          if (endIndex !== -1) {
            codeSection = codeSection.substring(0, endIndex + 1)
          }
        }
        
        if (codeSection.includes('export default') && codeSection.includes('return')) {
          console.log("GPT-5推理模式提取成功: 直接代码格式")
          return validateAndFixJSX(codeSection)
        }
      } else if (marker.startsWith('```')) {
        // 代码块格式
        const codeMatch = codeSection.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/)
        if (codeMatch && codeMatch[1].trim()) {
          console.log("GPT-5推理模式提取成功: 代码块格式")
          return validateAndFixJSX(codeMatch[1].trim())
        }
      }
    }
  }

  // 优先级1: 多种代码块格式匹配
  const codeBlockPatterns = [
    /```jsx\s*([\s\S]*?)```/,
    /```javascript\s*([\s\S]*?)```/,
    /```js\s*([\s\S]*?)```/,
    /```\s*([\s\S]*?)```/,  // 无语言标识的代码块
  ]
  
  for (const pattern of codeBlockPatterns) {
    const match = fullResponse.match(pattern)
    if (match && match[1].trim()) {
      const extracted = match[1].trim()
      if (extracted.includes('export default') || extracted.includes("'use client'")) {
        console.log("提取成功: 代码块格式")
        return validateAndFixJSX(extracted)
      }
    }
  }
  
  // 优先级2: 从'use client'开始的完整代码
  const useClientIndex = fullResponse.indexOf("'use client'")
  if (useClientIndex !== -1) {
    let content = fullResponse.substring(useClientIndex)
    
    // 移除结尾的代码块标记
    content = content.replace(/```\s*$/, '').trim()
    
    // 寻找合理的结束点
    const lastBraceIndex = content.lastIndexOf('}')
    if (lastBraceIndex !== -1) {
      content = content.substring(0, lastBraceIndex + 1)
    }
    
    // 检查并修复截断的import语句
    content = fixTruncatedImports(content)
    
    if (content.includes('export default') && content.includes('return')) {
      console.log("提取成功: use client 完整代码")
      return validateAndFixJSX(content)
    }
  }
  
  // 优先级3: 寻找export default函数
  const exportMatch = fullResponse.match(/export\s+default\s+function[\s\S]*?(?=\n\n|\n$|$)/m)
  if (exportMatch) {
    let extracted = exportMatch[0]
    // 确保包含完整的函数体
    const openBraces = (extracted.match(/\{/g) || []).length
    const closeBraces = (extracted.match(/\}/g) || []).length
    
    if (openBraces > closeBraces) {
      // 尝试找到完整的函数结束
      const remainingText = fullResponse.substring(fullResponse.indexOf(extracted) + extracted.length)
      let braceCount = openBraces - closeBraces
      let i = 0
      
      while (i < remainingText.length && braceCount > 0) {
        if (remainingText[i] === '{') braceCount++
        if (remainingText[i] === '}') braceCount--
        i++
      }
      
      if (braceCount === 0) {
        extracted += remainingText.substring(0, i)
      }
    }
    
    if (extracted.includes('return')) {
      console.log("提取成功: export default函数")
      return validateAndFixJSX("'use client'\n\nimport React from 'react'\n\n" + extracted)
    }
  }
  
  // 最后尝试：寻找任何看起来像React组件的代码
  const componentMatch = fullResponse.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\([\s\S]*?\)\s*\}/m)
  if (componentMatch) {
    console.log("提取成功: 基础React组件")
    return validateAndFixJSX("'use client'\n\nimport React from 'react'\n\nexport default " + componentMatch[0])
  }
  
  // 备用: 创建简单备用组件
  console.log("=== 所有提取方法失败，使用备用组件 ===")
  console.log("完整响应长度:", fullResponse.length)
  console.log("完整响应末尾500字符:", fullResponse.slice(-500))
  return createSimpleFallback()
}

// 修复截断的import语句
function fixTruncatedImports(content) {
  // 检查是否有截断的React import
  if (content.includes('from \'react\'') && !content.includes('import React')) {
    content = content.replace('from \'react\'', 'import React from \'react\'')
    console.log('修复截断的React import')
  }
  
  // 检查是否有其他截断的import语句
  const brokenImportMatch = content.match(/^\s*from\s+['"][^'"]+['"]/)
  if (brokenImportMatch) {
    const fromPart = brokenImportMatch[0].trim()
    // 尝试从上下文推断应该是什么import
    if (fromPart.includes('react')) {
      content = content.replace(fromPart, 'import React from \'react\'')
    }
    console.log('修复了截断的import:', fromPart)
  }
  
  return content
}

// 强化的JSX验证和修复
function validateAndFixJSX(jsxContent) {
  if (!jsxContent) return createSimpleFallback();
  
  console.log('开始强化JSX修复...')
  console.log('修复前内容长度:', jsxContent.length)
  
  // 1. 清理流式响应中的异常字符和格式
  jsxContent = cleanStreamingArtifacts(jsxContent)
  
  // 1.1 清理 TypeScript 语法，确保 JSX 兼容性
  jsxContent = cleanTypescriptSyntax(jsxContent)
  
  // 2. 确保'use client'在开头
  if (!jsxContent.startsWith("'use client'")) {
    jsxContent = "'use client'\n\n" + jsxContent.replace(/(['"]?)use\s+client(['"]?)\s*;?\s*\n?/gi, '');
  }
  
  // 3. 确保基础import存在
  if (!jsxContent.includes('import React')) {
    jsxContent = jsxContent.replace("'use client'\n\n", "'use client'\n\nimport React from 'react'\n")
  }
  
  // 3.1. 确保BadgeInfo在lucide-react导入中（SafeIcon必需）
  if (jsxContent.includes('lucide-react') && jsxContent.includes('SafeIcon')) {
    const lucideImportMatch = jsxContent.match(/import\s*{\s*([^}]*?)\s*}\s*from\s*['"]lucide-react['"]/)
    if (lucideImportMatch) {
      const currentImports = lucideImportMatch[1].split(',').map(item => item.trim())
      if (!currentImports.includes('BadgeInfo')) {
        const newImports = ['BadgeInfo', ...currentImports].join(', ')
        jsxContent = jsxContent.replace(
          /(import\s*{\s*)([^}]*?)(\s*}\s*from\s*['"]lucide-react['"])/,
          `$1${newImports}$3`
        )
        console.log('添加缺失的 BadgeInfo 导入')
      }
    } else if (!jsxContent.includes('import') || !jsxContent.includes('BadgeInfo')) {
      // 如果没有lucide-react导入但有SafeIcon，添加BadgeInfo导入
      jsxContent = jsxContent.replace(
        "import React from 'react'\n",
        "import React from 'react'\nimport { BadgeInfo } from 'lucide-react'\n"
      )
      console.log('添加缺失的 BadgeInfo 完整导入')
    }
  }
  
  // 4. 检查是否包含基本的组件结构
  const hasExportDefault = jsxContent.includes('export default')
  const hasFunction = jsxContent.includes('function ') || jsxContent.includes('const ') && jsxContent.includes('=>')
  const hasReturn = jsxContent.includes('return')
  const hasJSX = jsxContent.includes('<') && jsxContent.includes('>')
  
  if (!hasExportDefault || !hasFunction || !hasReturn || !hasJSX) {
    console.log('组件结构不完整，缺少:', {
      exportDefault: !hasExportDefault,
      function: !hasFunction, 
      return: !hasReturn,
      jsx: !hasJSX
    })
    
    // 尝试修复结构
    if (hasJSX && hasReturn) {
      // 有JSX和return，可能只是缺export default
      if (!hasExportDefault && hasFunction) {
        jsxContent = jsxContent.replace(/function\s+(\w+)/, 'export default function $1')
      }
    } else {
      // 结构损坏严重，使用备用组件
      console.log('JSX结构严重损坏，使用备用组件')
      return createSimpleFallback()
    }
  }
  
  // 5. 确保必要的lucide-react导入
  if (jsxContent.includes('lucide-react')) {
    // 检查是否缺少实际使用的图标
    const lucideImportMatch = jsxContent.match(/import\s*{\s*([^}]*?)\s*}\s*from\s*['"]lucide-react['"]/)
    
    if (lucideImportMatch) {
      const currentImports = lucideImportMatch[1].split(',').map(item => item.trim())
      
      // 提取当前导入中所有可用的图标名称（包括别名）
      const availableIcons = new Set()
      currentImports.forEach(imp => {
        if (imp.includes(' as ')) {
          // 处理别名：'Link as LinkIcon' -> 添加 'LinkIcon'
          const alias = imp.split(' as ')[1].trim()
          availableIcons.add(alias)
        } else {
          // 直接导入的图标
          availableIcons.add(imp)
        }
      })
      
      // 只检查在JSX中实际使用的图标（通过 <SafeIcon icon={IconName} 模式）
      const usedIconsMatches = jsxContent.match(/<SafeIcon\s+icon=\{(\w+)\}/g) || []
      const missingIcons = usedIconsMatches.map(match => {
        const iconMatch = match.match(/<SafeIcon\s+icon=\{(\w+)\}/)
        return iconMatch ? iconMatch[1] : null
      }).filter(icon => icon && !availableIcons.has(icon))
      
      // 去重
      const uniqueMissingIcons = [...new Set(missingIcons)]
      
      if (uniqueMissingIcons.length > 0) {
        const newImports = [...currentImports, ...uniqueMissingIcons].join(', ')
        jsxContent = jsxContent.replace(
          /(import\s*{\s*)([^}]*?)(\s*}\s*from\s*['"]lucide-react['"])/,
          `$1${newImports}$3`
        )
      }
    }
  }
  
  // 6. 修复组件结尾问题
  jsxContent = fixComponentEnding(jsxContent)
  
  // 7. 最终验证
  const finalHasExportDefault = jsxContent.includes('export default')
  const finalHasReturn = jsxContent.includes('return')
  
  if (!finalHasExportDefault || !finalHasReturn) {
    console.log('=== 最终验证失败 ===')
    console.log('包含 export default:', finalHasExportDefault)
    console.log('包含 return:', finalHasReturn)
    console.log('内容预览:', jsxContent.substring(0, 500))
    console.log('=== 使用备用组件 ===')
    return createSimpleFallback()
  }
  
  console.log('JSX修复完成，长度:', jsxContent.length)
  return jsxContent;
}


// 基础清理函数 - 现在只处理常见的格式问题
function cleanStreamingArtifacts(content) {
  console.log('执行基础内容清理...')
  
  let cleaned = content
  
  // 1. 清理异常字符
  cleaned = cleaned.replace(/^'\s*$/gm, '') // 移除单独的引号行
  cleaned = cleaned.replace(/\n'\n/g, '\n')
  cleaned = cleaned.replace(/\n\s*No newline at end of file\s*\n/g, '\n')
  
  // 2. 修复 import 语句中的语法错误（双逗号、空白项等）
  cleaned = cleaned.replace(/import\s*\{\s*([^}]*?)\s*\}\s*from\s*['"]([^'"]+)['"]/g, (_, imports, source) => {
    // 清理导入列表中的语法错误
    const cleanedImports = imports
      .split(',')
      .map(item => item.trim())
      .filter(item => item && item !== '' && item !== ',') // 移除空项和单独的逗号
      .join(', ')
    
    return `import {\n  ${cleanedImports}\n} from '${source}'`
  })
  
  return cleaned
}

// 清理 TypeScript 语法，确保 JSX 兼容性
function cleanTypescriptSyntax(content) {
  console.log('清理 TypeScript 语法...')
  
  let cleaned = content
  
  // 1. 移除 React.FC 类型注释
  cleaned = cleaned.replace(/:\s*React\.FC\s*=/g, ' =')
  
  // 2. 移除其他常见的 TypeScript 类型注释
  cleaned = cleaned.replace(/:\s*React\.FunctionComponent\s*=/g, ' =')
  cleaned = cleaned.replace(/:\s*FC\s*=/g, ' =')
  
  // 3. 修复多余的闭合括号
  // 查找 export default 后的多余括号
  cleaned = cleaned.replace(/(export\s+default\s+\w+)\s*\n\s*\}/g, '$1')
  
  // 4. 清理文件末尾的多余括号和内容
  cleaned = cleaned.replace(/}\s*\n\s*No newline at end of file\s*$/g, '')
  cleaned = cleaned.replace(/\n\s*No newline at end of file\s*$/g, '')
  cleaned = cleaned.replace(/No newline at end of file/g, '')
  
  // 5. 移除未使用的import项
  cleaned = cleaned.replace(/import\s*\{\s*([^}]*?)\s*\}\s*from\s*['"]([^'"]+)['"]/g, (_, imports, source) => {
    const importList = imports.split(',').map(item => item.trim()).filter(item => item)
    const usedImports = importList.filter(importItem => {
      const iconName = importItem.includes(' as ') ? importItem.split(' as ')[1].trim() : importItem
      return cleaned.includes(`icon={${iconName}}`) || cleaned.includes(`<${iconName}`)
    })
    
    if (usedImports.length === 0) return '' // 移除整个import语句
    return `import {\n  ${usedImports.join(', ')}\n} from '${source}'`
  })
  
  return cleaned
}

// 修复组件结尾的专用函数 - 强化版
function fixComponentEnding(jsxContent) {
  console.log('检查组件结尾...')
  
  let fixed = jsxContent.trim()
  
  // 确保最后的div标签闭合
  if (fixed.endsWith('</div')) {
    fixed += '>'
    console.log('修复未闭合的 div 标签')
  }
  
  // 强制确保组件有正确的return结尾
  if (!fixed.includes('  )') && !fixed.endsWith(')')) {
    fixed += '\n  )'
    console.log('强制添加 return 结尾 )')
  }
  
  // 强制确保组件有正确的函数结尾
  if (!fixed.endsWith('}')) {
    fixed += '\n}'
    console.log('强制添加函数结尾 }')
  }
  
  return fixed
}

// 简单备用组件
function createSimpleFallback() {
  return `'use client'

import React from 'react'
import { BadgeInfo, AlertCircle } from 'lucide-react'

const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  if (!Icon) {
    return <Fallback {...props} />
  }
  try {
    return <Icon {...props} />
  } catch (error) {
    return <Fallback {...props} />
  }
}

export default function BentoGrid() {
  return (
    <div className="min-h-screen bg-[#fefefe] p-4" style={{ fontFamily: 'Space Grotesk' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 bg-blue-50 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={AlertCircle} size={48} className="text-blue-500 mx-auto mb-4" />
              <div className="text-blue-500 text-2xl font-bold mb-2">生成中...</div>
              <div className="text-gray-600">请稍后重试</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`
}


// 保存生成的 JSX 到组件文件
function saveBentoGridComponent(jsxContent) {
  const componentsDir = path.join(process.cwd(), 'components')
  const filePath = path.join(componentsDir, 'BentoGrid.jsx')
  
  try {
    // 确保JSX内容完整
    const trimmedContent = jsxContent.trim()
    
    // 首先删除文件（如果存在），确保文件系统识别为新文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    // 直接写入JSX内容，不添加可能破坏结构的时间戳
    fs.writeFileSync(filePath, trimmedContent, 'utf8')
    
    // 标记生成状态
    const statusPath = path.join(process.cwd(), 'components', '.bento-status.json')
    fs.writeFileSync(statusPath, JSON.stringify({ 
      generated: true,
      timestamp: new Date().toISOString()
    }), 'utf8')
    
    return true
  } catch (error) {
    console.error("保存 Bento Grid 组件失败：", error)
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
    const { content, model = 'claude' } = await request.json()
    
    console.log('=== POST 请求分析 ===')
    console.log('模型:', model)
    console.log('内容长度:', content ? content.length : 0)
    console.log('内容预览:', content ? content.substring(0, 100) : 'undefined/null')
    console.log('内容类型:', typeof content)
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.log('内容验证失败，返回400错误')
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      )
    }
    
    // 创建一个流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // 创建一个节流版本的发送进度函数，最高频率为每 150ms 发送一次
        const throttledSend = throttle((text) => {
          // 格式化文本块
          const formattedText = formatStreamChunk(text)
          
          // 如果格式化后为空，则跳过发送
          if (!formattedText) return;
          
          // 创建 SSE 格式的消息并发送
          const message = `data: ${JSON.stringify({ text: formattedText })}\n\n`
          controller.enqueue(encoder.encode(message))
        }, 150);
        
        // 发送流式追踪事件（仅针对推理模型）
        const sendStreamingEvent = (eventType, data = {}) => {
          try {
            if (model === 'gpt-5') {
              // 发送符合 OpenAI Responses API 格式的事件
              const streamEvent = {
                type: eventType,
                ...data
              }
              const message = `data: ${JSON.stringify({ streamEvent })}\n\n`
              controller.enqueue(encoder.encode(message))
            }
          } catch (error) {
            console.error('发送流式追踪事件失败：', error)
          }
        }

        // 进度回调函数
        const sendProgress = (text) => {
          try {
            throttledSend(text);
          } catch (error) {
            console.error('发送进度更新失败：', error)
          }
        }
        
        try {
          // 发送开始事件（仅针对推理模型）
          sendStreamingEvent('response.queued', { message: '请求已排队' })
          
          // 根据模型选择调用相应的 API
          let jsxContent
          if (model === 'gpt-5') {
            // 发送推理开始事件
            sendStreamingEvent('response.in_progress', { message: '开始推理' })
            
            jsxContent = await generateBentoWithGPT5Stream(content, sendProgress, sendStreamingEvent)
          } else {
            jsxContent = await generateBentoWithClaudeStream(content, sendProgress)
          }
          
          // 保存生成的组件
          saveBentoGridComponent(jsxContent)
          
          // 发送完成事件（仅针对推理模型）
          sendStreamingEvent('response.completed', { 
            output: 'Bento Grid 生成完成！已创建响应式布局，具备流畅的动画效果和最佳的用户体验。',
            message: '推理完成' 
          })
          
          // 发送完成消息
          const completionMessage = `data: ${JSON.stringify({ text: '✅ 便当制作完成' })}\n\n`
          console.log('发送完成消息:', completionMessage)
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
    console.error('处理请求失败：', error)
    return NextResponse.json({ error: error.message || '处理请求失败' }, { status: 500 })
  }
} 