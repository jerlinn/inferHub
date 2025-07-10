'use client'

import React from 'react'
import { BarChart3, Brain, Bulb, Compass, ExternalLink, Eye, Filter, Focus, Microscope, BadgeInfo } from 'lucide-react'
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
    <div className="w-full max-w-7xl mx-auto p-4" style={{ background: '#fefefe' }}>
      <div className="grid grid-cols-12 gap-4">
        {/* Full width header card */}
        <Link 
          href="https://x.com/intent/follow?screen_name=eviljer"
          className="col-span-12 bg-blue-50 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center gap-4">
            <SafeIcon icon={Brain} size={48} className="text-blue-500" />
            <h2 className="text-2xl font-bold">第一性原理</h2>
          </div>
          <p className="mt-2 text-base">思考的基础方法：回归问题本质，从根本原理出发</p>
          <div className="flex items-center text-xs text-blue-500 mt-4">
            <span>了解更多</span>
            <SafeIcon icon={ExternalLink} size={14} className="ml-1" />
          </div>
        </Link>

        {/* Row 2: 2 equal cards */}
        <div className="col-span-6 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <SafeIcon icon={Microscope} size={48} className="text-blue-500 mb-2" />
          <h3 className="text-lg font-bold">分解问题</h3>
          <p className="text-base">将复杂事物拆解至最基本组成部分</p>
        </div>

        <div className="col-span-6 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <SafeIcon icon={Filter} size={48} className="text-blue-500 mb-2" />
          <h3 className="text-lg font-bold">去除假设</h3>
          <p className="text-base">识别并质疑所有隐含假设</p>
        </div>

        {/* Row 3: Full width card */}
        <div className="col-span-12 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <SafeIcon icon={Bulb} size={48} className="text-blue-500" />
            <h3 className="text-lg font-bold">重新构建</h3>
          </div>
          <p className="text-base mt-2">基于基本原理而非类比或传统重建解决方案</p>
        </div>

        {/* Row 4: 3 equal cards */}
        <div className="col-span-4 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <SafeIcon icon={Focus} size={48} className="text-blue-500 mb-2" />
          <h3 className="text-lg font-bold">减少偏见</h3>
          <p className="text-base">避免思维定式和路径依赖</p>
        </div>

        <div className="col-span-4 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <SafeIcon icon={Eye} size={48} className="text-blue-500 mb-2" />
          <h3 className="text-lg font-bold">洞察本质</h3>
          <p className="text-base">发现表象下的核心规律</p>
        </div>

        <div className="col-span-4 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <SafeIcon icon={Compass} size={48} className="text-blue-500 mb-2" />
          <h3 className="text-lg font-bold">指导创新</h3>
          <p className="text-base">突破常规思维限制</p>
        </div>

        {/* Row 5: Full width bottom card */}
        <div className="col-span-12 bg-blue-50/70 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <SafeIcon icon={BarChart3} size={48} className="text-blue-500" />
            <h3 className="text-lg font-bold">应用领域</h3>
          </div>
          <p className="text-base mt-2">商业模式创新、科学研究、产品设计、战略决策</p>
        </div>
      </div>
    </div>
  )
}

export default BentoGrid

// Generated at: 2025-05-23T13:04:01.182Z