'use client'

import { useState } from 'react'
import { BadgeInfo, Users, Award, TrendingUp, MessageCircle, DollarSign, Briefcase, BatteryMedium, Globe } from 'lucide-react'

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
  const primary = "text-violet-500"
  const primaryBg = "bg-violet-100"
  const secondaryBg = "bg-violet-50"
  
  const coreLinkUrl = "https://x.com/intent/follow?screen_name=eviljer"
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 font-[Space_Grotesk]" style={{ backgroundColor: "#fefefe" }}>
      <div className="grid grid-cols-3 gap-4">
        {/* Main card - spans full width */}
        <div className={`col-span-3 ${primaryBg} p-6 rounded-2xl flex flex-col justify-between`}>
          <div className="flex items-center gap-3">
            <SafeIcon icon={Users} size={48} className={primary} />
            <h2 className="text-2xl font-bold">小年说</h2>
          </div>
          <p className="mt-3 text-base">
            全平台账号覆盖：抖音、视频号、小红书
          </p>
          <div className="mt-auto text-sm text-right">
            <a href={coreLinkUrl} target="_blank" rel="noopener noreferrer" className={`${primary} hover:underline`}>
              了解更多
            </a>
          </div>
        </div>

        {/* Row 2 - Three cards */}
        <div className={`${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={Briefcase} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">职业经历一</h3>
          <p className="text-base mt-2">
            <span className="font-bold"> 6 </span>年艺人导演经纪人
          </p>
          <p className="text-base mt-1">
            杨天真创业团队核心成员
          </p>
        </div>

        <div className={`${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={TrendingUp} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">职业经历二</h3>
          <p className="text-base mt-2">
            <span className="font-bold"> 4 </span>年MCN/自媒体经验
          </p>
          <p className="text-base mt-1">
            抖音百万/千万粉丝博主幕后操盘
          </p>
        </div>

        <div className={`${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={Globe} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">内容创作</h3>
          <p className="text-base mt-2">
            多平台创作上千条视频
          </p>
          <p className="text-base mt-1">
            抖音+小红书+视频号全覆盖
          </p>
        </div>

        {/* Row 3 - Two cards */}
        <div className={`col-span-2 ${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={Award} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">成长轨迹</h3>
          <p className="text-base mt-2">
            <span className="font-bold"> 0 </span>粉丝 {'>'} <span className="font-bold"> 1000万 </span>粉丝
          </p>
          <p className="text-base mt-1">
            变现从<span className="font-bold"> 0 </span>到亿级规模
          </p>
        </div>

        <div className={`${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={DollarSign} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">变现能力</h3>
          <p className="text-base mt-2">
            自媒体完整商业化运营
          </p>
          <p className="text-base mt-1">
            从起步到亿级变现实战经验
          </p>
        </div>

        {/* Row 4 - One card spans full width */}
        <div className={`col-span-3 ${secondaryBg} p-6 rounded-2xl`}>
          <SafeIcon icon={MessageCircle} size={38} className={primary} />
          <h3 className="text-lg font-bold mt-2">专业咨询</h3>
          <p className="text-base mt-2">
            踩坑经验分享：从粉丝增长、内容创作到变现途径完整解析
          </p>
          <p className="text-base mt-1">
            有自媒体和社交媒体变现问题欢迎在评论区咨询
          </p>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-10T05:21:38.562Z