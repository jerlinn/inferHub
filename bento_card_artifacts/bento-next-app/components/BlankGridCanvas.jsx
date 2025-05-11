'use client'

import React from 'react'

/**
 * 这个组件用于在截图前临时添加到DOM中，确保网格间隙和布局规则被正确解析
 * 使用display:none确保不会实际显示在页面上
 */
export default function BlankGridCanvas() {
  return (
    <div className="hidden">
      {/* 示例网格容器 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-violet-100"></div>
        <div className="col-span-2 p-6 rounded-2xl bg-violet-50"></div>
        <div className="col-span-3 p-6 rounded-2xl bg-violet-100"></div>
      </div>
    </div>
  )
} 