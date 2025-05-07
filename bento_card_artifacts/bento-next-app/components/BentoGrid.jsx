'use client'

"use client"

import React from 'react'
import {
  BadgeInfo,
  Milestone,
  TimerReset,
  Contrast,
  Dice5,
  FlaskConical,
  Hourglass,
  Backpack,
  Footprints
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

export default function StorytellingBento() {
  const baseColor = '#0066cc'
  const accentColor = '#0066cc'
  const primarySurface = '#e8f3ff'
  const secondarySurface = '#f5f9ff'
  
  return (
    <div 
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        backgroundColor: '#fefefe',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'auto',
          gap: '16px',
        }}
      >
        {/* Core Block - 如何讲好故事 */}
        <div
          style={{
            backgroundColor: primarySurface,
            padding: '28px',
            borderRadius: '16px',
            gridColumn: 'span 2',
            gridRow: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://x.com/intent/follow?screen_name=eviljer', '_blank')}
        >
          <div>
            <SafeIcon icon={Milestone} size={48} color={accentColor} />
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginTop: '16px', color: '#111' }}>如何讲好故事</h2>
            <p style={{ fontSize: '18px', color: '#555', marginTop: '8px' }}>Matthew Dicks 的核心讲故事原则</p>
          </div>
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '16px', color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: 'white', marginRight: '12px', fontSize: '14px', fontWeight: '600' }}>1</span>
              每个好故事源于「五秒瞬间」的转变或感悟
            </p>
            <p style={{ fontSize: '16px', color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: 'white', marginRight: '12px', fontSize: '14px', fontWeight: '600' }}>2</span>
              开头和结尾形成鲜明对比
            </p>
            <p style={{ fontSize: '16px', color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: 'white', marginRight: '12px', fontSize: '14px', fontWeight: '600' }}>3</span>
              故事必须有赌注—让听众关心和好奇
            </p>
          </div>
        </div>

        {/* 五秒瞬间 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '24px', 
            borderRadius: '16px',
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <SafeIcon icon={TimerReset} size={32} color={accentColor} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px', color: '#111' }}>五秒瞬间</h3>
          </div>
          <p style={{ fontSize: '16px', marginTop: '12px', color: '#444' }}>
            讲述转变或感悟的关键时刻，让听众与你一起体验这个瞬间
          </p>
          <p style={{ fontSize: '16px', marginTop: '8px', color: '#444', fontStyle: 'italic' }}>
            每天记录值得讲述的生活瞬间（人生作业）
          </p>
        </div>

        {/* 对比 */}
        <div
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '24px', 
            borderRadius: '16px',
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <SafeIcon icon={Contrast} size={32} color={accentColor} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px', color: '#111' }}>开头与结尾对比</h3>
          </div>
          <p style={{ fontSize: '16px', marginTop: '12px', color: '#444' }}>
            故事初始与结束状态应形成鲜明对比，突显转变过程
          </p>
        </div>

        {/* 赌注 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '24px', 
            borderRadius: '16px',
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <SafeIcon icon={Dice5} size={32} color={accentColor} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px', color: '#111' }}>故事的赌注</h3>
          </div>
          <p style={{ fontSize: '16px', marginTop: '12px', color: '#444' }}>
            打造赌注的五种方法
          </p>
        </div>
        
        {/* 大象 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '20px', 
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SafeIcon icon={FlaskConical} size={24} color={accentColor} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginLeft: '8px', color: '#111' }}>大象</h4>
          </div>
          <p style={{ fontSize: '16px', marginTop: '8px', color: '#444' }}>
            开头放置重大事件引人注意
          </p>
        </div>

        {/* 水晶球 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '20px', 
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SafeIcon icon={Hourglass} size={24} color={accentColor} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginLeft: '8px', color: '#111' }}>沙漏</h4>
          </div>
          <p style={{ fontSize: '16px', marginTop: '8px', color: '#444' }}>
            关键时刻放慢节奏增强悬念
          </p>
        </div>

        {/* 沙漏&背包 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '20px', 
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SafeIcon icon={Backpack} size={24} color={accentColor} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginLeft: '8px', color: '#111' }}>背包</h4>
          </div>
          <p style={{ fontSize: '16px', marginTop: '8px', color: '#444' }}>
            提前透露目标引发情感投入
          </p>
        </div>

        {/* 面包屑 */}
        <div 
          style={{ 
            backgroundColor: secondarySurface, 
            padding: '20px', 
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SafeIcon icon={Footprints} size={24} color={accentColor} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginLeft: '8px', color: '#111' }}>面包屑</h4>
          </div>
          <p style={{ fontSize: '16px', marginTop: '8px', color: '#444' }}>
            留下信息线索维持好奇心
          </p>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-07T15:05:50.043Z