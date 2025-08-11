'use client'

import { useState, useRef, useEffect } from 'react'
import { Wand, Twitter, Github, LoaderPinwheel, Lightbulb, Grid, User, ShoppingBag, BookOpen, BarChart3 } from 'lucide-react'
import Link from 'next/link'


export default function Home() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamOutput, setStreamOutput] = useState([])
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedModel, setSelectedModel] = useState('claude')
  
  const streamRef = useRef(null)
  const streamAbortController = useRef(null)
  const outputBuffer = useRef('') // 用于累积不完整的文本片段
  const reasoningTimeoutRef = useRef(null) // 推理超时定时器

  // 客户端加载后设置挂载状态
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 自动滚动到最新输出
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight
    }
  }, [streamOutput])

  // 清理函数，在组件卸载时中止任何正在进行的请求
  useEffect(() => {
    return () => {
      if (streamAbortController.current) {
        streamAbortController.current.abort()
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    setIsLoading(true)
    setStreamOutput(['Ingredients locked and loaded, chef at work!'])
    outputBuffer.current = '' // 重置缓冲区
    
    try {
      // 创建一个 AbortController 实例以便在需要时中止请求
      streamAbortController.current = new AbortController()
      
      // 发送内容到 API 端点，使用流式响应
      const response = await fetch('/api/generate-bento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, model: selectedModel }),
        signal: streamAbortController.current.signal
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `请求失败 (${response.status})`)
      }
      
      // 处理 Server-Sent Events (SSE) 流
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('流结束')
          break
        }
        
        // 解码二进制数据
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        
        // 处理所有完整的 SSE 消息
        const messages = buffer.split('\n\n')
        buffer = messages.pop() || '' // 最后一个可能是不完整的消息，保存到下一次循环
        
        for (const message of messages) {
          if (!message.trim() || !message.startsWith('data:')) continue
          
          try {
            // 解析消息数据 - 使用最优解析方式
            const dataStr = message.substring(5).trim()
            const data = JSON.parse(dataStr)
            
            // 处理思维链事件（仅针对推理模型）
            if (data.streamEvent && selectedModel === 'gpt-5') {
              if (data.streamEvent.type === 'response.in_progress') {
                setStreamOutput(prev => {
                  const filtered = prev.filter(line => !line.includes('💭') && !line.includes('🧠'))
                  return [...filtered, '⚡ GPT-5 极速模式启动...']
                })
                
                // 在minimal模式下，设置更短的超时时间（10秒）
                if (reasoningTimeoutRef.current) {
                  clearTimeout(reasoningTimeoutRef.current)
                }
                reasoningTimeoutRef.current = setTimeout(() => {
                  setStreamOutput(prev => {
                    const hasReasoningStatus = prev.some(line => line.includes('💭') || line.includes('🧠') || line.includes('⚡'))
                    if (hasReasoningStatus) {
                      const filtered = prev.filter(line => !line.includes('💭') && !line.includes('🧠') && !line.includes('⚡'))
                      return [...filtered, '🤔 处理时间较长，请稍候...']
                    }
                    return prev
                  })
                }, 10000) // minimal模式应该更快，减少到10秒
              } else if (data.streamEvent.type === 'response.reasoning_summary.delta' && data.streamEvent.delta?.text) {
                // 显示实际的推理过程，累积显示
                const reasoningText = data.streamEvent.delta.text
                setStreamOutput(prev => {
                  const filtered = prev.filter(line => !line.includes('💭') && !line.includes('🧠 推理:'))
                  const lastReasoning = prev.find(line => line.includes('🧠 推理:'))
                  const currentReasoning = lastReasoning ? lastReasoning.replace('🧠 推理: ', '') + reasoningText : reasoningText
                  
                  // 限制推理内容长度，避免过长
                  const truncatedReasoning = currentReasoning.length > 200 ? 
                    currentReasoning.substring(0, 200) + '...' : currentReasoning
                  
                  return [...filtered, `🧠 推理: ${truncatedReasoning}`]
                })
              } else if (data.streamEvent.type === 'response.reasoning_summary.done') {
                // 推理完成，准备开始内容生成
                if (reasoningTimeoutRef.current) {
                  clearTimeout(reasoningTimeoutRef.current)
                  reasoningTimeoutRef.current = null
                }
                setStreamOutput(prev => {
                  const filtered = prev.filter(line => !line.includes('💭') && !line.includes('🧠'))
                  return [...filtered, '✨ 推理完成，开始生成内容...']
                })
              }
            }
            
            if (data.text) {
              console.log('收到文本消息:', data.text)
              // 当开始接收实际内容时，清理推理状态并显示内容
              setStreamOutput(prev => {
                // 如果是真正的内容输出（不是状态消息），清理状态显示
                const isActualContent = !data.text.includes('💭') && !data.text.includes('🧠') && !data.text.includes('🤔') && !data.text.includes('⚡')
                if (isActualContent) {
                  // 清理推理超时器
                  if (reasoningTimeoutRef.current) {
                    clearTimeout(reasoningTimeoutRef.current)
                    reasoningTimeoutRef.current = null
                  }
                  const filtered = prev.filter(line => !line.includes('💭') && !line.includes('🧠') && !line.includes('🤔') && !line.includes('⚡'))
                  return [...filtered, data.text]
                }
                return [...prev, data.text]
              })
              
              // 如果收到完成消息，准备重定向
              if (data.text === '✅ 便当制作完成') {
                console.log('收到完成消息，准备重定向...')
                setStreamOutput(prev => [...prev, '🔄 正在准备跳转到结果页面...'])
                
                // 确保在UI更新后再跳转
                setTimeout(() => {
                  const timestamp = Date.now()
                  console.log(`正在跳转到: /bento-view?t=${timestamp}`)
                  
                  // 使用window.location进行强制跳转，确保不带example参数
                  window.location.href = `/bento-view?t=${timestamp}`
                }, 1000)
              }
            }
          } catch (e) {
            console.warn('解析 SSE 消息失败：', e)
          }
        }
      }
      
    } catch (error) {
      console.error('生成 Bento Grid 请求失败：', error)
      setStreamOutput(prev => [...prev, `❌ 错误：${error.message || '未知错误'}`])
    } finally {
      setIsLoading(false)
      streamAbortController.current = null
      
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 pt-20 sm:pt-20 md:px-6 md:pt-20 md:pb-12 bg-[#fafafa]">
      <div 
        className={`w-full max-w-2xl mx-auto ${isMounted ? 'animate-fade-in' : 'opacity-0'}`} 
        style={{ 
          transitionDuration: '500ms'
        }}
      >
        {/* 外层阴影容器 */}
        <div 
          className="relative mb-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* 底层大阴影 */}
          <div 
            className="absolute -inset-4 blur-2xl transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.12)',
              transform: `translateY(${isHovering ? '8px' : '10px'})`,
              opacity: isHovering ? 0.17 : 0.12,
              zIndex: 0
            }}
          />
          {/* 中层阴影 */}
          <div 
            className="absolute -inset-2 blur-xl transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.1)',
              transform: `translateY(${isHovering ? '3px' : '4px'})`,
              opacity: isHovering ? 0.15 : 0.1,
              zIndex: 0
            }}
          />
          {/* 靠近卡片的阴影 */}
          <div 
            className="absolute -inset-1 blur-sm transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.08)',
              transform: `translateY(${isHovering ? '1px' : '2px'})`,
              opacity: isHovering ? 0.13 : 0.08,
              zIndex: 0
            }}
          />
          
          {/* 主卡片内容 */}
          <div 
            className="relative bg-white rounded-[32px] overflow-hidden p-6 transition-transform duration-300"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(249, 249, 249, 1) 100%)',
              boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.03)',
              transform: isHovering ? 'translateY(-1px)' : 'translateY(0)',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* 内部高光边框 */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 0 0.5px rgba(255, 255, 255, 0.9), inset 0 0.5px 0 0 rgba(255, 255, 255, 1)',
                zIndex: 1
              }}
            />
            <h1 className="text-3xl font-bold mb-6 mt-2 text-center flex items-center justify-center gap-2">
              <span className="text-4xl">🍱</span> 
              <span>Bento Grid Maker</span>
            </h1>
            
            {/* 模型选择器 */}
            <div className="mb-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedModel('claude')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedModel === 'claude' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Claude 4
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel('gpt-5')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedModel === 'gpt-5' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  GPT-5 Thinking
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入问题或粘贴任意内容"
                className="w-full p-4 bg-gray-50/80 text-sm rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-vertical transition-colors duration-200 hover:border-gray-200"
                disabled={isLoading}
                style={{ 
                  overflowY: 'auto',
                  minHeight: '12rem',
                  maxHeight: '24rem',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
                }}
              />
              
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className={`relative flex items-center justify-center gap-2 bg-orange-500 text-white rounded-xl font-medium py-3 px-4 h-14 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-orange-600 active:translate-y-0.5'
                } transition-all duration-150`}
                style={{
                  boxShadow: '0 2px 5px rgba(234, 88, 12, 0.2), 0 1px 2px rgba(234, 88, 12, 0.1), 0 0 0 1px rgba(234, 88, 12, 0.1)'
                }}
              >
                {isLoading ? (
                  <>
                    便当制作中
                    <LoaderPinwheel className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    生成
                    <Wand className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            
            {/* 流式输出追踪卡片 */}
            {isLoading && streamOutput.length > 0 && (
              <div className="mt-6 relative">
                <div className="relative overflow-hidden rounded-xl">
                  {/* 外层容器 - 处理描边 */}
                  <div 
                    className="p-[1px] rounded-xl bg-gradient-to-tr from-gray-200 via-gray-200 to-gray-200"
                    style={{
                      boxShadow: '0 0 0 1px rgba(234, 88, 12, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* 内层滚动容器的包装 */}
                    <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                      {/* 渐变遮罩层 - 固定在容器上方 */}
                      <div 
                        className="pointer-events-none absolute inset-x-0 top-0 h-6 z-10"
                        style={{ 
                          background: 'linear-gradient(to bottom, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%)'
                        }}
                      />
                      
                      {/* 内层滚动容器 */}
                      <div 
                        ref={streamRef}
                        className="h-28 p-4 overflow-y-auto text-sm text-gray-600"
                        style={{ 
                          scrollBehavior: 'smooth',
                        }}
                      >
                        {/* 内容区域 - 显示完整响应，无截断处理 */}
                        <div className="relative pt-2 pb-2">
                          {streamOutput.map((line, index) => (
                            <div 
                              key={index} 
                              className="mb-1.5 text-gray-700 animate-fadeIn whitespace-pre-wrap"
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 渐变遮罩层 - 固定在容器下方 */}
                      <div 
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 z-10"
                        style={{ 
                          background: 'linear-gradient(to top, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 示例模板选项 */}
            <div className="mt-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-gray-500" />
                  <span>示例</span>
                </h3>
                
                <div className="overflow-x-auto hide-scrollbar -mx-0 pr-0 w-full">
                  <div className="flex items-center gap-3 pl-1 pr-0 py-1 whitespace-nowrap">
                    <Link 
                      href="/bento-view?example=default" 
                      className="flex flex-row items-center px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition group gap-2 min-w-[72px] justify-center"
                    >
                      <div className="text-gray-600 size-4 flex items-center justify-center group-hover:text-blue-500">
                        <Grid className="size-4" />
                      </div>
                      <span className="text-xs text-gray-900 font-medium">默认</span>
                    </Link>
                    <Link 
                      href="/bento-view?example=BentoGrid_BIO" 
                      className="flex flex-row items-center px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition group gap-2 min-w-[72px] justify-center"
                    >
                      <div className="text-gray-600 size-4 flex items-center justify-center group-hover:text-blue-500">
                        <User className="size-4" />
                      </div>
                      <span className="text-xs text-gray-900 font-medium">档案</span>
                    </Link>
                    <Link 
                      href="/bento-view?example=BentoGrid_goods" 
                      className="flex flex-row items-center px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition group gap-2 min-w-[72px] justify-center"
                    >
                      <div className="text-gray-600 size-4 flex items-center justify-center group-hover:text-blue-500">
                        <ShoppingBag className="size-4" />
                      </div>
                      <span className="text-xs text-gray-900 font-medium">商品</span>
                    </Link>
                    <Link 
                      href="/bento-view?example=BentoGrid_knowledge_nagomi" 
                      className="flex flex-row items-center px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition group gap-2 min-w-[72px] justify-center"
                    >
                      <div className="text-gray-600 size-4 flex items-center justify-center group-hover:text-blue-500">
                        <BookOpen className="size-4" />
                      </div>
                      <span className="text-xs text-gray-900 font-medium">概念</span>
                    </Link>
                    <Link 
                      href="/bento-view?example=BentoGrid_konwledge_NVR" 
                      className="flex flex-row items-center px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition group gap-2 min-w-[72px] justify-center"
                    >
                      <div className="text-gray-600 size-4 flex items-center justify-center group-hover:text-blue-500">
                        <BarChart3 className="size-4" />
                      </div>
                      <span className="text-xs text-gray-900 font-medium">数据</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full flex justify-between items-center text-sm text-gray-500">
          <div></div>
          
          <div className="flex items-center space-x-6">
            <p>Powered by Aihubmix</p>
            <span className="mx-1">⋮</span>
            <Link 
              href="https://x.com/intent/follow?screen_name=eviljer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link 
              href="https://github.com/jerlinn/inferHub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

    </main>
  )
}