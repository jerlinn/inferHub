'use client'

import React from 'react'
import {
  BadgeInfo, Leaf, Fish, Apple, Wheat, Droplets, HeartPulse, ChefHat, CupSoda, Beef
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

export default function BentoMediterraneanDiet() {
  // Palette: single hue family (teal). Vivid for main, soft for secondary. Icons use accent teal-500.
  // Layout: 2 rows, tightly-packed, full rectangular coverage, 7 blocks total.
  // Max height control to avoid overflow on mobile.
  return (
    <section
      className="w-full max-w-5xl mx-auto px-4"
      style={{ background: '#fefefe' }}
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          // keep within single screen
          maxHeight: '100vh'
        }}
      >
        {/* Row 1: 12 columns total */}
        {/* Main Hero Card spans 8 cols */}
        <a
          href="https://x.com/intent/follow?screen_name=eviljer"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-12 sm:col-span-8 rounded-2xl p-4 bg-teal-100/70 overflow-hidden"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-start gap-3">
            <SafeIcon icon={HeartPulse} size={48} className="text-teal-500 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900 truncate">
                地中海饮食法
              </h2>
              <p className="text-sm text-neutral-700 mt-1">
                关键词：橄榄油、全谷、蔬果、豆类、坚果、鱼类、适量奶酪，少红肉
              </p>
              <ul className="text-sm text-neutral-800 mt-3 space-y-1">
                <li>核心益处：心血管支持、代谢平衡、抗炎</li>
                <li>结构原则：植物为主，优质脂肪，适度蛋白，多样与适量</li>
                <li>生活方式：与家人共享、慢食、日常活动</li>
              </ul>
            </div>
          </div>
        </a>

        {/* Supporting card spans 4 cols */}
        <div
          className="col-span-12 sm:col-span-4 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Leaf} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              每日基底
            </div>
          </div>
          <ul className="mt-2 text-sm text-neutral-800 space-y-1">
            <li>蔬果丰富：颜色多样</li>
            <li>全谷主食：燕麦、糙米、全麦</li>
            <li>豆类与坚果：纤维与微量营养素</li>
          </ul>
        </div>

        {/* Row 2: 12 columns total */}
        <div
          className="col-span-12 sm:col-span-3 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Droplets} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              橄榄油为主
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-800">
            主要用特级初榨橄榄油，替代黄油与精炼油
          </p>
        </div>

        <div
          className="col-span-12 sm:col-span-3 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Fish} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              海鲜与鱼
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-800">
            每周 2 - 3 次鱼类或海鲜，优先富脂鱼
          </p>
        </div>

        <div
          className="col-span-12 sm:col-span-2 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Apple} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              乳制品
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-800">
            适量酸奶、奶酪，注意总量
          </p>
        </div>

        <div
          className="col-span-12 sm:col-span-2 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Beef} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              少红肉
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-800">
            红肉与加工肉减少，禽类适量
          </p>
        </div>

        <div
          className="col-span-12 sm:col-span-2 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={Wheat} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              全谷优先
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-800">
            精制替换为全谷，控制份量
          </p>
        </div>

        {/* Single full-width row (still part of row 2 in mobile, row 3 in sm+) */}
        <div
          className="col-span-12 rounded-2xl p-4 bg-teal-50/70"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={ChefHat} size={32} className="text-teal-500" />
            <div className="text-neutral-900 text-base font-medium">
              实用要点
            </div>
          </div>
          <ul className="mt-2 text-sm text-neutral-800 grid grid-cols-2 gap-x-4 gap-y-1">
            <li>用油替黄油，冷拌与低温烹</li>
            <li>每餐加一份蔬菜或沙拉</li>
            <li>坚果一小把，避免加盐糖</li>
            <li>餐桌慢食，与人共享</li>
            <li>每日步行与日光暴露</li>
            <li>限制含糖饮料与甜点</li>
          </ul>
          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
            <SafeIcon icon={CupSoda} size={16} className="text-teal-500" />
            <span>酒精非必需，若饮用，餐时少量红酒为宜</span>
          </div>
        </div>
      </div>
    </section>
  )
}