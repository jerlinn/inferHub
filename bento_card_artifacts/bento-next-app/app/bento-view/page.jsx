'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { House, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

// 导入错误边界组件
const BentoErrorBoundary = dynamic(() => import('../../components/BentoErrorBoundary'), {
  ssr: false
})

// 动态导入 BentoGrid 组件，添加noCache选项确保每次都重新加载
const DynamicBentoGrid = dynamic(() => {
  // 使用时间戳作为缓存破坏，但不添加到文件名中
  const timestamp = Date.now()
  console.log(`Loading BentoGrid with cache key: ${timestamp}`)
  
  // 让dynamic加载器处理缓存
  return import('../../components/BentoGrid')
    .catch((err) => {
      console.error('Failed to load BentoGrid:', err)
      return import('../../components/DefaultBentoGrid')
    })
}, { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-48 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
})

// 默认 Bento Grid 组件
const DefaultBentoGrid = dynamic(() => import('../../components/DefaultBentoGrid'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-48 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  )
})

export default function BentoView() {
  const searchParams = useSearchParams()
  const example = searchParams.get('example')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useDefault, setUseDefault] = useState(false)
  const [isExample, setIsExample] = useState(false)
  const [refreshKey, setRefreshKey] = useState(Date.now()) // 添加强制刷新的 key

  // 强制刷新函数
  const handleRefresh = () => {
    setLoading(true)
    setRefreshKey(Date.now())
  }

  useEffect(() => {
    // 检查是否是示例模式
    if (example === 'default') {
      setIsExample(true)
      setLoading(false)
      return
    }

    // 组件挂载时，确认已生成 Bento Grid
    const fetchBentoStatus = async () => {
      try {
        // 添加时间戳防止请求被缓存
        const response = await fetch(`/api/bento-status?t=${Date.now()}`)
        const data = await response.json()
        
        if (!data.generated) {
          setUseDefault(true)
        }
      } catch (error) {
        console.error('Error fetching bento status:', error)
        setUseDefault(true)
      } finally {
        setLoading(false)
      }
    }

    fetchBentoStatus()
  }, [refreshKey, example]) // 依赖refreshKey和example参数

  return (
    <main className="min-h-screen bg-slate-50 pb-8 pt-8 px-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <House className="mr-2 h-4 w-4" />
            Home
          </Link>
          
          <button
            onClick={handleRefresh}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            title="刷新"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-lg shadow-[#f1f1f1] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {isExample && (
                <div className="bg-violet-50 border-l-4 border-violet-400 text-violet-700 p-4 m-4 md:m-8 rounded-r-xl">
                  <p>这是示例 Bento Grid。返回首页提交文本内容可生成自定义的 Bento Grid。</p>
                </div>
              )}
              
              {useDefault && !isExample && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-4 md:m-8 rounded-r-md">
                  <p>使用默认 Bento Grid 组件展示。你可以返回首页提交文本内容来生成自定义的 Bento Grid。</p>
                </div>
              )}
              
              <div className="p-4 md:p-8">
                {/* 根据参数决定显示示例或生成的内容，并用错误边界包裹 */}
                {isExample ? (
                  <DefaultBentoGrid key={refreshKey} />
                ) : (
                  <BentoErrorBoundary>
                    <DynamicBentoGrid key={refreshKey} />
                  </BentoErrorBoundary>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
} 