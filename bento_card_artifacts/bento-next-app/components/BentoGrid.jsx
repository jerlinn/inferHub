'use client'

import React from 'react'
import { BadgeInfo, Heart, Gift, Calendar, MessageCircleHeart, Coffee, UtensilsCrossed } from 'lucide-react'
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
    <div className="w-full max-w-5xl mx-auto p-4 bg-[#fefefe]">
      <div className="grid grid-cols-3 gap-4">
        {/* Row 1: Full-width header */}
        <div className="col-span-3 bg-rose-50 p-6 rounded-2xl flex flex-col items-center justify-center">
          <SafeIcon icon={Heart} size={48} className="text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-rose-900 text-center">母亲节庆祝指南</h2>
        </div>

        {/* Row 2: Three equal cards */}
        <div className="bg-rose-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Calendar} size={32} className="text-rose-500 mb-2" />
          <h3 className="font-semibold text-rose-900 mb-1">日期</h3>
          <p className="text-rose-800 text-base">五月第二个星期日</p>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Gift} size={32} className="text-rose-500 mb-2" />
          <h3 className="font-semibold text-rose-900 mb-1">礼物推荐</h3>
          <p className="text-rose-800 text-base">个性化纪念品</p>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl">
          <SafeIcon icon={MessageCircleHeart} size={32} className="text-rose-500 mb-2" />
          <h3 className="font-semibold text-rose-900 mb-1">表达感谢</h3>
          <p className="text-rose-800 text-base">真挚问候与感谢</p>
        </div>

        {/* Row 3: Two cards - one double width, one single */}
        <div className="col-span-2 bg-rose-50/70 p-5 rounded-2xl">
          <SafeIcon icon={UtensilsCrossed} size={32} className="text-rose-500 mb-2" />
          <h3 className="font-semibold text-rose-900 mb-1">特别活动</h3>
          <p className="text-rose-800 text-base">准备一顿丰盛早餐或温馨家庭聚餐</p>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Coffee} size={32} className="text-rose-500 mb-2" />
          <h3 className="font-semibold text-rose-900 mb-1">品质时光</h3>
          <p className="text-rose-800 text-base">陪伴交流最珍贵</p>
        </div>

        {/* Row 4: Full-width footer */}
        <Link 
          href="https://x.com/intent/follow?screen_name=eviljer" 
          className="col-span-3 bg-rose-50/70 p-5 rounded-2xl text-center hover:bg-rose-100/80 transition-colors"
        >
          <p className="text-rose-800 text-base font-medium">感恩母亲的爱与付出，每一天都是感谢的好时机</p>
        </Link>
      </div>
    </div>
  )
}

export default BentoGrid

// Generated at: 2025-05-11T13:06:41.451Z