'use client'

import React from 'react'
import { Zap, Brain, Sparkles, RotateCw, Search, Lightbulb } from 'lucide-react'

// 添加缓存破坏注释
// Last updated: ${new Date().toISOString()}

export default function DefaultBentoGrid() {
  // 添加控制台日志，确认组件加载
  console.log('DefaultBentoGrid loaded at:', new Date().toISOString())
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* 主卡片 */}
        <div className="col-span-12 md:col-span-6 bg-violet-50 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <Zap size={48} className="text-violet-600" />
            <h2 className="text-2xl font-bold">AI 时代的超能力</h2>
          </div>
          <p className="mt-4 text-lg">从语言到具象化的即时创造力</p>
        </div>
        
        {/* 卡片2 */}
        <div className="col-span-12 md:col-span-6 bg-violet-50/70 rounded-2xl p-6">
          <Brain size={40} className="text-violet-600 mb-4" />
          <h3 className="text-xl font-semibold">语言具象化能力</h3>
          <p className="mt-2">想法 → 作品 摩擦消除</p>
        </div>
        
        {/* 卡片3 */}
        <div className="col-span-6 md:col-span-4 bg-violet-50/70 rounded-2xl p-6">
          <RotateCw size={40} className="text-violet-600 mb-4" />
          <h3 className="text-xl font-semibold">大规模自动化</h3>
          <p className="mt-2">执行复利</p>
        </div>
        
        {/* 卡片4 */}
        <div className="col-span-6 md:col-span-4 bg-violet-50/70 rounded-2xl p-6">
          <Sparkles size={40} className="text-violet-600 mb-4" />
          <h3 className="text-xl font-semibold">洞察力增强</h3>
          <p className="mt-2">发现隐藏模式</p>
        </div>
        
        {/* 卡片5 */}
        <div className="col-span-12 md:col-span-4 bg-violet-50/70 rounded-2xl p-6">
          <Search size={40} className="text-violet-600 mb-4" />
          <h3 className="text-lg font-semibold">不只是搜索</h3>
          <p className="mt-2">海水退去，珍珠显现</p>
        </div>
        
        {/* 卡片6 */}
        <div className="col-span-12 bg-violet-50/70 rounded-2xl p-6 text-center">
          <Lightbulb size={40} className="text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">最稀缺的依然是</h3>
          <p className="mt-2 text-lg font-bold">敢问好问题的人</p>
        </div>
      </div>
    </div>
  )
} 