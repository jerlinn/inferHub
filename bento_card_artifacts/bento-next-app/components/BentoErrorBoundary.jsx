'use client'

import React from 'react'
import { AlertCircle, BadgeInfo, RefreshCw, House } from 'lucide-react'

// 图标安全组件：处理未定义的图标或渲染失败的情况
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

export class BentoErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('BentoGrid error caught by error boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 检查错误消息中是否包含图标相关关键词
      const isIconError = this.state.error?.message?.toLowerCase().includes('icon') || 
                          this.state.error?.stack?.toLowerCase().includes('icon')
      
      return (
        <div className="w-full max-w-6xl mx-auto p-6 font-sans">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-start">
              <SafeIcon icon={AlertCircle} className="text-red-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">
                  Bento卡片渲染失败
                </p>
                <p className="text-red-600 mt-1 text-sm">
                  {isIconError 
                    ? '图标加载错误，已尝试使用默认图标' 
                    : (this.state.error?.message || '卡片代码解析错误')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 text-white px-4 py-2 rounded-full mr-3 text-sm flex items-center"
            >
              <House className="mr-1 h-4 w-4" />
              返回首页
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm flex items-center"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              刷新页面
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <BadgeInfo className="text-blue-500 mr-2 h-4 w-4" />
                <p className="text-sm font-medium text-gray-700">常见原因及解决方法</p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 list-inside list-disc">
                {isIconError ? (
                  <li>图标引用错误已尝试自动替换为默认图标</li>
                ) : (
                  <li>生成的代码可能存在语法或逻辑错误</li>
                )}
                <li>重新生成卡片或简化输入文本可解决大多数问题</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 便于 Server Components 中使用的包装组件
export default function BentoErrorBoundaryWrapper({ children }) {
  return (
    <BentoErrorBoundary>
      {children}
    </BentoErrorBoundary>
  )
} 