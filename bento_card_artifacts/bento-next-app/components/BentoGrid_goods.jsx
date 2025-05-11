'use client'

import React from 'react'
import { 
  BadgeInfo, 
  Bird, 
  Award, 
  Droplets, 
  HeartHandshake, 
  AudioWaveform, 
  Gift, 
  ShowerHead, 
  Lightbulb
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
  return (
    <div className="w-full p-6 bg-[#fefefe] font-['Space_Grotesk']">
      <div className="grid grid-cols-12 gap-4">
        {/* 主卡片 - 全宽度 */}
        <div className="col-span-12 bg-pink-100 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-pink-900">逗豆鸟</h2>
            <SafeIcon icon={Bird} size={48} className="text-pink-500" />
          </div>
          <p className="mt-2 text-pink-800">
            经典入门级设计 · 震动+吮吸 · 破亿销售额 · 天猫类目Top1
          </p>
        </div>

        {/* 三卡片一行 */}
        <div className="col-span-4 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <SafeIcon icon={AudioWaveform} size={32} className="text-pink-500 mb-2" />
          <h3 className="font-semibold text-pink-800">声波技术</h3>
          <p className="text-sm text-pink-700 mt-1">
            Sonic声波吮吸技术
            <br />
            3档可调节强度
          </p>
        </div>

        <div className="col-span-4 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <SafeIcon icon={Droplets} size={32} className="text-pink-500 mb-2" />
          <h3 className="font-semibold text-pink-800">防水设计</h3>
          <p className="text-sm text-pink-700 mt-1">
            IPX6级防水
            <br />
            可直接冲洗/淋浴使用
          </p>
        </div>

        <div className="col-span-4 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <SafeIcon icon={HeartHandshake} size={32} className="text-pink-500 mb-2" />
          <h3 className="font-semibold text-pink-800">舒适材质</h3>
          <p className="text-sm text-pink-700 mt-1">
            双层柔软硅胶
            <br />
            FDA级标准安全材质
          </p>
        </div>

        {/* 两卡片一行 */}
        <div className="col-span-6 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <SafeIcon icon={ShowerHead} size={32} className="text-pink-500 mb-2" />
          <h3 className="font-semibold text-pink-800">使用场景</h3>
          <p className="text-sm text-pink-700 mt-1">
            日常放松 · 浴室享受
            <br />
            浪漫纪念日 · 异地恋情
          </p>
        </div>

        <div className="col-span-6 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <SafeIcon icon={Lightbulb} size={32} className="text-pink-500 mb-2" />
          <h3 className="font-semibold text-pink-800">贴心设计</h3>
          <p className="text-sm text-pink-700 mt-1">
            安全锁功能 · 极静设计
            <br />
            电量提示 · 暖光氛围灯
          </p>
        </div>

        {/* 全宽度卡片 */}
        <div className="col-span-12 bg-pink-50 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-pink-800">设计荣誉</h3>
            <SafeIcon icon={Award} size={32} className="text-pink-500" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-pink-700">
            <div className="bg-pink-100/50 rounded-lg p-2 text-center">2019 台湾金点设计奖</div>
            <div className="bg-pink-100/50 rounded-lg p-2 text-center">2019 德国红点设计大奖</div>
            <div className="bg-pink-100/50 rounded-lg p-2 text-center">2020 美国 IDEA 设计铜奖</div>
          </div>
        </div>

        {/* 购买链接卡片 */}
        <a 
          href="https://detail.tmall.com/item.htm?id=682202291873" 
          target="_blank" 
          rel="noopener noreferrer"
          className="col-span-12 bg-pink-100 rounded-2xl p-6 flex items-center justify-between transition hover:bg-pink-200 cursor-pointer"
        >
          <h3 className="font-bold text-xl text-pink-800">立即购买 - 百万女生口碑推荐</h3>
          <SafeIcon icon={Gift} size={32} className="text-pink-500" />
        </a>
      </div>
    </div>
  )
}

// Generated at: 2025-05-09T14:59:52.003Z