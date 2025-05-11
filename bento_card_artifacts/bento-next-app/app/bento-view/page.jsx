'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { House, RefreshCw, User, ShoppingBag, BookOpen, BarChart3, Grid } from 'lucide-react'
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
const DefaultBentoGrid = dynamic(() => import('../../components/BentoGrid_konwledge_NVR'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-48 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  )
})

// 动态映射所有 BentoGrid 组件
const gridComponentMap = {
  default: dynamic(() => import('../../components/BentoGrid_stableGrid'), { ssr: false }),
  BentoGrid_BIO: dynamic(() => import('../../components/BentoGrid_BIO'), { ssr: false }),
  BentoGrid_goods: dynamic(() => import('../../components/BentoGrid_goods'), { ssr: false }),
  BentoGrid_knowledge_nagomi: dynamic(() => import('../../components/BentoGrid_knowledge_nagomi'), { ssr: false }),
  BentoGrid_konwledge_NVR: dynamic(() => import('../../components/BentoGrid_konwledge_NVR'), { ssr: false }),
}

export default function BentoView() {
  const searchParams = useSearchParams()
  const example = searchParams.get('example') || 'default'
  const timestamp = searchParams.get('t')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useDefault, setUseDefault] = useState(false)
  const [isExample, setIsExample] = useState(false)
  const [refreshKey, setRefreshKey] = useState(Date.now()) // 添加强制刷新的 key
  const [currentTab, setCurrentTab] = useState(example)
  const [isFromGeneration, setIsFromGeneration] = useState(false) // 判断是否来自生成页面

  // 检测URL参数变化更新当前tab
  useEffect(() => {
    setCurrentTab(example)
    
    // 检测是否来自生成页面的跳转 - 有时间戳参数但没有example参数
    setIsFromGeneration(searchParams.has('t') && !searchParams.has('example'))
  }, [example, searchParams])

  // 强制刷新函数
  const handleRefresh = () => {
    setLoading(true)
    setRefreshKey(Date.now())
  }

  useEffect(() => {
    // 检查是否是示例模式或来自生成页面
    if (example === 'default' && !isFromGeneration) {
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
  }, [refreshKey, example, isFromGeneration]) // 依赖refreshKey, example和isFromGeneration

  // 隐藏滚动条样式
  const hideScrollbarStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-8 pt-8 px-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <House className="mr-2 h-4 w-4" />
            Home
          </Link>

          {/* 根据不同状态显示不同内容：示例分类tab或生成结果标题 */}
          {isFromGeneration ? (
            <div className="flex-1 flex justify-center">
              <h2 className="text-gray-800 font-medium text-sm md:text-base">
                生成结果
              </h2>
            </div>
          ) : (
            <div className="overflow-x-auto flex items-center -mx-2" style={hideScrollbarStyle}>
              <div className="flex items-center gap-3 px-4 py-1 whitespace-nowrap">
                <Link 
                  href="/bento-view?example=default" 
                  className={`flex flex-row items-center px-3 py-2 rounded-full bg-white border shadow-sm hover:bg-blue-50 transition group gap-2 min-w-[72px] justify-center
                    ${currentTab === 'default' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => setCurrentTab('default')}
                >
                  <Grid className={`${currentTab === 'default' ? 'text-blue-500' : 'text-gray-600'}`} size={16} />
                  <span className="text-xs text-gray-900 font-medium">默认</span>
                </Link>
                <Link 
                  href="/bento-view?example=BentoGrid_BIO" 
                  className={`flex flex-row items-center px-3 py-2 rounded-full bg-white border shadow-sm hover:bg-blue-50 transition group gap-2 min-w-[72px] justify-center
                    ${currentTab === 'BentoGrid_BIO' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => setCurrentTab('BentoGrid_BIO')}
                >
                  <User className={`${currentTab === 'BentoGrid_BIO' ? 'text-blue-500' : 'text-gray-600'}`} size={16} />
                  <span className="text-xs text-gray-900 font-medium">档案</span>
                </Link>
                <Link 
                  href="/bento-view?example=BentoGrid_goods" 
                  className={`flex flex-row items-center px-3 py-2 rounded-full bg-white border shadow-sm hover:bg-blue-50 transition group gap-2 min-w-[72px] justify-center
                    ${currentTab === 'BentoGrid_goods' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => setCurrentTab('BentoGrid_goods')}
                >
                  <ShoppingBag className={`${currentTab === 'BentoGrid_goods' ? 'text-blue-500' : 'text-gray-600'}`} size={16} />
                  <span className="text-xs text-gray-900 font-medium">商品</span>
                </Link>
                <Link 
                  href="/bento-view?example=BentoGrid_knowledge_nagomi" 
                  className={`flex flex-row items-center px-3 py-2 rounded-full bg-white border shadow-sm hover:bg-blue-50 transition group gap-2 min-w-[72px] justify-center
                    ${currentTab === 'BentoGrid_knowledge_nagomi' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => setCurrentTab('BentoGrid_knowledge_nagomi')}
                >
                  <BookOpen className={`${currentTab === 'BentoGrid_knowledge_nagomi' ? 'text-blue-500' : 'text-gray-600'}`} size={16} />
                  <span className="text-xs text-gray-900 font-medium">概念</span>
                </Link>
                <Link 
                  href="/bento-view?example=BentoGrid_konwledge_NVR" 
                  className={`flex flex-row items-center px-3 py-2 rounded-full bg-white border shadow-sm hover:bg-blue-50 transition group gap-2 min-w-[72px] justify-center
                    ${currentTab === 'BentoGrid_konwledge_NVR' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => setCurrentTab('BentoGrid_konwledge_NVR')}
                >
                  <BarChart3 className={`${currentTab === 'BentoGrid_konwledge_NVR' ? 'text-blue-500' : 'text-gray-600'}`} size={16} />
                  <span className="text-xs text-gray-900 font-medium">数据</span>
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={handleRefresh}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 ml-4"
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
            <div className="p-4 md:p-8">
              {/* 动态加载对应 BentoGrid 组件 */}
              {(() => {
                // 如果是从生成页面跳转来的，且没有标记为使用默认组件，加载动态生成的 BentoGrid
                if (isFromGeneration && !useDefault) {
                  console.log('Loading dynamically generated BentoGrid')
                  return <DynamicBentoGrid key={refreshKey} />;
                }
                
                // 否则加载对应的示例组件
                const key = example && gridComponentMap[example] ? example : 'default';
                const GridComponent = gridComponentMap[key];
                return <GridComponent key={refreshKey} />
              })()}
            </div>
          )}
        </div>
      </div>
      <footer className="mt-10 flex justify-center items-center w-full text-xs text-gray-400">
        © 2024 Bento Grid Maker
      </footer>
    </main>
  )
} 