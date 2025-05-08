'use client'

import React from 'react'
import { 
  BadgeInfo, 
  Target, 
  Brain, 
  TimerOff, 
  ArrowRightLeft, 
  CheckCircle, 
  GitCompare
} from 'lucide-react'

// SafeIcon: if failed, use BadgeInfo as fallback
const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  // 首先检查图标是否未定义
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

export default function BentoGrid() {
  const accentColor = "#2563eb" // Primary accent color for icons
  const mainCardBg = "#ebf3ff" // Vivid surface tone for main card
  const secondaryCardBg = "#f5f9ff" // Soft tone for secondary cards

  return (
    <div className="max-w-5xl mx-auto p-4" style={{ 
      fontFamily: "'Space Grotesk', sans-serif",
      background: "#fefefe",
      minHeight: "100vh",
      color: "#333"
    }}>
      <div className="grid grid-cols-3 gap-4">
        {/* Core Block - Spans 2x2 */}
        <div className="col-span-2 row-span-2 rounded-2xl p-6 flex flex-col" 
          style={{ background: mainCardBg, position: 'relative' }}
          onClick={() => window.open("https://x.com/intent/follow?screen_name=eviljer", "_blank")}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">课题分离</h2>
              <p className="text-base opacity-80">把"学习"还原成价值创造的直线</p>
            </div>
            <SafeIcon icon={Target} size={48} className="flex-shrink-0" style={{ color: accentColor }} />
          </div>
          <div className="mt-2">
            <p className="text-base mb-4">学习本身不产生价值，只有知识在具体课题中应用才能转化为能量</p>
            <div className="mt-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                <span>Learning is the map, not the territory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Learning Becomes a Trap */}
        <div className="rounded-2xl p-5" style={{ background: secondaryCardBg }}>
          <div className="flex items-start gap-3 mb-3">
            <SafeIcon icon={Brain} size={32} style={{ color: accentColor }} />
            <h3 className="font-semibold text-lg">学习陷阱</h3>
          </div>
          <ul className="ml-2 space-y-2 text-base">
            <li>注意力错置在进度而非结果</li>
            <li>身份幻觉带来提前满足感</li>
            <li>回避风险、延后失败</li>
          </ul>
        </div>

        {/* Two Paths Comparison */}
        <div className="rounded-2xl p-5" style={{ background: secondaryCardBg }}>
          <div className="flex items-start gap-3 mb-3">
            <SafeIcon icon={ArrowRightLeft} size={32} style={{ color: accentColor }} />
            <h3 className="font-semibold text-lg">路径对比</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold">伪学习:</p>
              <p>章节/课时/证书</p>
              <p>长反馈周期</p>
            </div>
            <div>
              <p className="font-semibold">课题分离:</p>
              <p>可量化结果</p>
              <p>短闭环反馈</p>
            </div>
          </div>
        </div>

        {/* Implementation Method */}
        <div className="col-span-2 rounded-2xl p-5" style={{ background: secondaryCardBg }}>
          <div className="flex items-start gap-3 mb-3">
            <SafeIcon icon={CheckCircle} size={32} style={{ color: accentColor }} />
            <h3 className="font-semibold text-lg">从"学"到"干"的实施方法</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-base">
            <div>
              <p className="font-semibold mb-1">1. 效用问题标题</p>
              <p>"学Python" → "批量整理 300 张发票脚本"</p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. 最小可行解</p>
              <p>缩小范围至可一天验证的大小</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. 反向索引知识</p>
              <p>按需"懒加载"，遇障碍再学</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. 价值日志</p>
              <p>记录时间、金钱、情绪收益</p>
            </div>
          </div>
        </div>

        {/* Time-saving */}
        <div className="rounded-2xl p-5" style={{ background: secondaryCardBg }}>
          <div className="flex items-start gap-3 mb-3">
            <SafeIcon icon={TimerOff} size={32} style={{ color: accentColor }} />
            <h3 className="font-semibold text-lg">时间效率</h3>
          </div>
          <p className="text-base">最大化投入产出比，避免盲目知识储备，专注解决卡点</p>
        </div>

        {/* Learning as By-product */}
        <div className="col-span-3 rounded-2xl p-5" style={{ background: secondaryCardBg }}>
          <div className="flex items-start gap-3 mb-3">
            <SafeIcon icon={GitCompare} size={32} style={{ color: accentColor }} />
            <h3 className="font-semibold text-lg">学习成为副产品</h3>
          </div>
          <p className="text-base mb-3">
            当课题先行，学习变成自然副作用：攻关时查到的新语法、为省时而学的并发模型、为说服而读的报告...
          </p>
          <p className="text-base font-medium">
            下次想"学点什么"时，先问："如果明天要交付，卡脖子的是什么？"
          </p>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-07T15:18:56.738Z