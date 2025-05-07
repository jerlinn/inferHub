'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wand, Twitter, Github, LoaderPinwheel, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [streamOutput, setStreamOutput] = useState([])
  const router = useRouter()
  const streamRef = useRef(null)
  const streamAbortController = useRef(null)
  const outputBuffer = useRef('') // 用于累积不完整的文本片段

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
    setError('')
    setStreamOutput(['Ingredients locked and loaded, chef at work!'])
    outputBuffer.current = '' // 重置缓冲区
    
    try {
      // 创建一个 AbortController 实例以便在需要时中止请求
      streamAbortController.current = new AbortController()
      
      // 发送内容到API端点，使用流式响应
      const response = await fetch('/api/generate-bento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
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
            
            if (data.text) {
              // 不截断或格式化消息，直接显示原始返回
              setStreamOutput(prev => [...prev, data.text])
              
              // 如果收到完成消息，准备重定向
              if (data.text === '✅ 便当制作完成') {
                setTimeout(() => {
                  // 添加时间戳参数，确保每次都获取新页面
                  router.push(`/bento-view?t=${Date.now()}`)
                }, 800)
              }
            }
          } catch (e) {
            console.warn('解析 SSE 消息失败:', e)
          }
        }
      }
      
    } catch (error) {
      console.error('生成 Bento Grid 请求失败:', error)
      setError(error.message || '生成失败，请重试')
      setStreamOutput(prev => [...prev, `❌ 错误: ${error.message || '未知错误'}`])
    } finally {
      setIsLoading(false)
      streamAbortController.current = null
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-24 bg-[#fafafa]">
      <div className="w-full max-w-2xl mx-auto">
        <div 
          className="bg-white rounded-3xl overflow-hidden p-6 mb-6"
          style={{
            boxShadow: '0 10px 25px -12px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)',
            transform: 'translateY(0px)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <h1 className="text-3xl font-bold mb-8 mt-6 text-center">🍱 Bento Grid Maker</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入问题或粘贴任意内容"
              className="w-full h-64 p-4 bg-gray-50/50 text-base rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-vertical"
              disabled={isLoading}
              style={{ 
                overflowY: 'auto',
                minHeight: '12rem',
                maxHeight: '24rem'
              }}
            />
            
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className={`flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl font-medium py-3 px-4 h-14 ${
                isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-violet-700'
              } transition-colors`}
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
                    boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
        </div>
        
        <div className="w-full flex justify-between items-center text-sm text-gray-500">
          <Link 
            href="/bento-view?example=default" 
            className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-violet-600 transition-colors p-1"
          >
            <Lightbulb className="h-4 w-4" />
            <span>示例</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <p>Powered by Claude Sonnet 3.7</p>
            <span className="mx-1">⋮</span>
            <Link 
              href="https://x.com/intent/follow?screen_name=eviljer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-500 hover:text-violet-600 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link 
              href="https://github.com/jerlinn/inferHub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-500 hover:text-violet-600 transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
