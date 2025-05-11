'use client'

import React from 'react'
import { BadgeInfo, Activity, HeartPulse, Pizza, Cookie, Candy, Salt, Brain, BarChart3, ChartPie, Ham, Flame } from 'lucide-react'
import Link from 'next/link'

// SafeIcon: if failed, use BadgeInfo as fallback
const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  if (!Icon) {
    console.warn(`Icon is undefined, using fallback`)
    return <Fallback {...props} />
  }
  
  try {
    return <Icon {...props} />
  } catch (error) {
    console.warn(`Icon rendering failed, using fallback icon`, error)
    return <Fallback {...props} />
  }
}

const BentoGrid = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-['Space_Grotesk']">
      <div className="grid grid-cols-12 gap-4">
        {/* Header - Full Width */}
        <div className="col-span-12 bg-blue-50 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">营养成分表解码指南</h1>
          <p className="text-gray-900">轻松理解食品标签中的 NRV% 数值及其背后含义</p>
          <div className="mt-4 flex items-center">
            <SafeIcon icon={ChartPie} size={40} className="text-blue-500 mr-3" />
            <p className="text-gray-700 text-sm">NRV% = 一份食物占推荐日摄入量的百分比</p>
          </div>
        </div>
        
        {/* Row 1 - 2 cards */}
        <div className="col-span-4 bg-blue-50/70 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-bold text-blue-900">NRV% 是什么</h2>
            <SafeIcon icon={BadgeInfo} size={24} className="text-blue-500" />
          </div>
          <p className="text-gray-900 text-sm">每 100g 营养含量 ÷ 推荐摄入量 × 100%</p>
          <p className="text-gray-700 text-sm mt-2">例：钠 800mg，NRV% = 40%，意味着已摄入每日推荐量的 40%</p>
        </div>
        
        <div className="col-span-8 bg-blue-50/70 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-bold text-blue-900">解读 NRV% 区间</h2>
            <SafeIcon icon={BarChart3} size={24} className="text-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-sm font-bold text-blue-900">{'<'} 5%</span>
              <p className="text-gray-700 text-xs">极低含量，可以大胆吃</p>
            </div>
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-sm font-bold text-blue-900">5% ~ 20%</span>
              <p className="text-gray-700 text-xs">中等水平，日常适量</p>
            </div>
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-sm font-bold text-blue-900">{'>'} 20%</span>
              <p className="text-gray-700 text-xs">高含量，注意控制摄入</p>
            </div>
          </div>
        </div>
        
        {/* Row 2 - Single full width card */}
        <div className="col-span-12 bg-blue-50 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-bold text-blue-900">关键营养素速查表</h2>
            <SafeIcon icon={HeartPulse} size={24} className="text-blue-500" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="bg-white/70 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <SafeIcon icon={Flame} size={16} className="text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-900">能量</span>
              </div>
              <p className="text-gray-700 text-xs">{'>'} 200kcal/100g 为高热量</p>
            </div>
            <div className="bg-white/70 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <SafeIcon icon={Ham} size={16} className="text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-900">蛋白质</span>
              </div>
              <p className="text-gray-700 text-xs">NRV% {'>'} 15% 为优质蛋白源</p>
            </div>
            <div className="bg-white/70 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <SafeIcon icon={Pizza} size={16} className="text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-900">脂肪</span>
              </div>
              <p className="text-gray-700 text-xs">看总脂肪与饱和脂肪</p>
            </div>
            <div className="bg-white/70 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <SafeIcon icon={Candy} size={16} className="text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-900">糖</span>
              </div>
              <p className="text-gray-700 text-xs">{'>'} 15g/100g 为高糖</p>
            </div>
            <div className="bg-white/70 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <SafeIcon icon={Salt} size={16} className="text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-900">钠</span>
              </div>
              <p className="text-gray-700 text-xs">NRV% {'>'} 30% 已偏高</p>
            </div>
          </div>
        </div>
        
        {/* Row 3 - 2 cards */}
        <div className="col-span-6 bg-blue-50/70 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-bold text-blue-900">高手进阶：3 秒判断法</h2>
            <SafeIcon icon={Brain} size={24} className="text-blue-500" />
          </div>
          <ul className="text-gray-900 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <span>热量 {'>'} 200kcal/100g = 高热量食物</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <span>钠 NRV% {'>'} 20% = 重口味，别多吃</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <span>蛋白 NRV% {'>'} 15% = 优质蛋白源</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <span>糖 {'>'} 15g/100g = 高糖食品</span>
            </li>
          </ul>
        </div>
        
        <div className="col-span-6 bg-blue-50/70 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-bold text-blue-900">实例：饼干营养解读</h2>
            <SafeIcon icon={Cookie} size={24} className="text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-gray-900 text-xs font-bold">能量 500kcal (25%)</span>
              <p className="text-gray-700 text-xs">热量高，不适合减肥</p>
            </div>
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-gray-900 text-xs font-bold">脂肪 24g (40%)</span>
              <p className="text-gray-700 text-xs">脂肪高，偏油</p>
            </div>
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-gray-900 text-xs font-bold">糖 30g</span>
              <p className="text-gray-700 text-xs">糖高，血糖快速升高</p>
            </div>
            <div className="bg-white/60 p-2 rounded-lg">
              <span className="text-gray-900 text-xs font-bold">蛋白质 4g (7%)</span>
              <p className="text-gray-700 text-xs">蛋白质少，不抗饿</p>
            </div>
          </div>
          <p className="text-gray-700 text-xs mt-3">结论：高热量+高脂+高糖+低蛋白 = 典型的「上瘾零食」</p>
        </div>
      </div>
      
      <Link 
        href="https://x.com/intent/follow?screen_name=eviljer" 
        className="block mt-4 text-center text-xs text-gray-500 hover:underline"
      >
        @eviljer
      </Link>
    </div>
  )
}

export default BentoGrid

// Generated at: 2025-05-11T05:41:17.753Z