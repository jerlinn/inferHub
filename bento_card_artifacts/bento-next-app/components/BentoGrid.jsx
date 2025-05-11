'use client'

import React from 'react'
import Link from 'next/link'
import {
  BadgeInfo,
  Globe,
  CreditCard,
  ArrowRightLeft,
  Building,
  Wallet,
  Bank,
  Banknote,
  ExternalLink
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

const BentoGrid = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Row 1 - Full Width Card */}
        <div className="col-span-3 bg-blue-50 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">海外资金回款路径</h2>
            <SafeIcon icon={Globe} size={32} className="text-blue-500" />
          </div>
          <p className="text-base text-gray-700">
            安全高效的四步海外资金回流方案
          </p>
        </div>

        {/* Row 2 - Two Cards */}
        <div className="col-span-2 bg-blue-50/70 p-6 rounded-2xl">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-800">境外支付渠道</h3>
          </div>
          <div className="flex items-center">
            <SafeIcon icon={Wallet} size={24} className="text-blue-500 mr-2" />
            <p className="text-base text-gray-700">
              香港公司开通 Stripe/Paypal 收款
            </p>
          </div>
        </div>
        
        <div className="col-span-1 bg-blue-50/70 p-6 rounded-2xl">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-800">提现流转</h3>
          </div>
          <div className="flex items-center">
            <SafeIcon icon={Building} size={24} className="text-blue-500 mr-2" />
            <p className="text-base text-gray-700">
              空中云汇公司账户
            </p>
          </div>
        </div>

        {/* Row 3 - Two Cards */}
        <div className="col-span-1 bg-blue-50/70 p-6 rounded-2xl">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-800">个人香港卡</h3>
          </div>
          <div className="flex items-center">
            <SafeIcon icon={CreditCard} size={24} className="text-blue-500 mr-2" />
            <p className="text-base text-gray-700">
              提现到香港银行卡
            </p>
          </div>
        </div>
        
        <div className="col-span-2 bg-blue-50/70 p-6 rounded-2xl">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
              4
            </div>
            <h3 className="text-lg font-bold text-gray-800">国内到账</h3>
          </div>
          <div className="flex items-center">
            <SafeIcon icon={Bank} size={24} className="text-blue-500 mr-2" />
            <p className="text-base text-gray-700">
              转入个人国内银行卡
            </p>
          </div>
        </div>

        {/* Row 4 - Full Width Card */}
        <Link href="https://x.com/intent/follow?screen_name=eviljer" 
              className="col-span-3 bg-blue-50/70 p-6 rounded-2xl hover:bg-blue-100/80 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SafeIcon icon={ArrowRightLeft} size={24} className="text-blue-500 mr-3" />
              <p className="text-base text-gray-700">
                完整资金流：香港公司收款 → 空中云汇 → 香港卡 → 国内银行卡
              </p>
            </div>
            <SafeIcon icon={ExternalLink} size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default BentoGrid

// Generated at: 2025-05-11T06:12:59.893Z