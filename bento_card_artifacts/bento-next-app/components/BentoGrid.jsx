'use client'

import React from 'react'
import {
  BadgeInfo, Moon, Sun, Coffee, Smartphone, Thermometer, Dumbbell, Clock, CheckCircle
} from 'lucide-react'

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

export default function SleepImprovementBento() {
  return (
    <div className="p-4 bg-[#fefefe] min-h-screen font-['Space_Grotesk']">
      <div className="max-w-4xl mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
        
        {/* Main Title Card - Full Width */}
        <div className="col-span-12 bg-blue-50 rounded-2xl p-6 flex items-center justify-center">
          <div className="text-center">
            <SafeIcon icon={Moon} size={48} className="text-blue-500 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-blue-900"> 7 天睡眠改善方法</h1>
            <p className="text-blue-700 mt-2">科学提升睡眠质量</p>
          </div>
        </div>

        {/* Day 1-2 Row */}
        <div className="col-span-6 bg-blue-60 rounded-2xl p-5">
          <SafeIcon icon={Clock} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 1 天</h3>
          <p className="text-blue-800">建立固定作息时间</p>
          <p className="text-blue-700 text-sm mt-1">每天同一时间睡觉起床</p>
        </div>

        <div className="col-span-6 bg-blue-70 rounded-2xl p-5">
          <SafeIcon icon={Smartphone} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 2 天</h3>
          <p className="text-blue-800">睡前 1 小时断电</p>
          <p className="text-blue-700 text-sm mt-1">避免蓝光干扰褪黑素</p>
        </div>

        {/* Day 3-4 Row */}
        <div className="col-span-4 bg-blue-60 rounded-2xl p-4">
          <SafeIcon icon={Coffee} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 3 天</h3>
          <p className="text-blue-800">下午 2 点后禁咖啡因</p>
        </div>

        <div className="col-span-8 bg-blue-70 rounded-2xl p-4">
          <SafeIcon icon={Thermometer} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 4 天</h3>
          <p className="text-blue-800">优化睡眠环境温度</p>
          <p className="text-blue-700 text-sm mt-1">保持卧室温度在 18-22 度之间</p>
        </div>

        {/* Day 5-6 Row */}
        <div className="col-span-7 bg-blue-50 rounded-2xl p-4">
          <SafeIcon icon={Dumbbell} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 5 天</h3>
          <p className="text-blue-800">增加白天运动量</p>
          <p className="text-blue-700 text-sm mt-1">但避免睡前 3 小时剧烈运动</p>
        </div>

        <div className="col-span-5 bg-blue-70 rounded-2xl p-4">
          <SafeIcon icon={Sun} size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">第 6 天</h3>
          <p className="text-blue-800">早晨晒太阳</p>
          <p className="text-blue-700 text-sm mt-1">调节生物钟</p>
        </div>

        {/* Day 7 - Final Card */}
        <div className="col-span-12 bg-blue-50 rounded-2xl p-5">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={CheckCircle} size={40} className="text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-blue-900 mb-2">第 7 天 - 建立睡前仪式</h3>
              <p className="text-blue-800">洗澡 → 阅读 → 深呼吸 → 入睡</p>
              <div className="mt-4">
                <a 
                  href="https://x.com/intent/follow?screen_name=eviljer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  获取更多健康建议
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}