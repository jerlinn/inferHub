'use client'

import React from 'react'
import { 
  BadgeInfo, 
  Brain, 
  Clock, 
  Focus, 
  Heart, 
  LineChart, 
  Settings, 
  Target, 
  ZapOff 
} from 'lucide-react'
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

export default function FlowStateBentoGrid() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-[#fefefe]">
      <div className="grid grid-cols-3 gap-4">
        {/* Row 1: Main card spans full width */}
        <div className="col-span-3 bg-blue-50 p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-gray-800">心流状态</h2>
            <SafeIcon icon={Brain} size={36} className="text-blue-500" />
          </div>
          <p className="text-gray-700 text-base">专注、高效、充满创造力的最佳心理状态</p>
        </div>

        {/* Row 2: Two cards */}
        <div className="col-span-1 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={Focus} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">全神贯注</h3>
          <p className="text-gray-700 text-base">完全沉浸于当下任务</p>
        </div>

        <div className="col-span-2 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={LineChart} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">技能与挑战平衡</h3>
          <p className="text-gray-700 text-base">任务难度恰好略高于当前能力水平</p>
        </div>

        {/* Row 3: Three cards */}
        <div className="col-span-1 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={Clock} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">时间感扭曲</h3>
          <p className="text-gray-700 text-base">几小时如同几分钟</p>
        </div>

        <div className="col-span-1 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={Heart} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">内在奖励</h3>
          <p className="text-gray-700 text-base">活动本身带来满足感</p>
        </div>

        <div className="col-span-1 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={Target} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">明确目标</h3>
          <p className="text-gray-700 text-base">清晰的方向与反馈</p>
        </div>

        {/* Row 4: Two cards */}
        <div className="col-span-2 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <SafeIcon icon={ZapOff} size={48} className="text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">阻碍因素</h3>
          <p className="text-gray-700 text-base">干扰通知、压力、疲劳、频繁切换任务</p>
        </div>

        <div className="col-span-1 bg-blue-50/70 p-5 rounded-2xl flex flex-col">
          <Link href="https://x.com/intent/follow?screen_name=eviljer" className="w-full h-full flex flex-col">
            <SafeIcon icon={Settings} size={48} className="text-blue-500 mb-3" />
            <h3 className="font-medium text-gray-800 mb-1">培养方法</h3>
            <p className="text-gray-700 text-base">减少干扰，增加挑战性</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-11T05:36:43.459Z