'use client'

import React from 'react'
import { BadgeInfo, Zap, Heart, Droplets, Award, Volume2, Lock, BatteryCharging, Smile } from 'lucide-react'

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
    <div style={{ 
      padding: '24px',
      background: '#fefefe',
      fontFamily: "'Space Grotesk', sans-serif",
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
        gap: '16px',
        gridTemplateAreas: `
          "main main sub1"
          "main main sub2"
          "sub3 sub4 sub5"
        `
      }}>
        {/* 主卡片 */}
        <a href="https://detail.tmall.com/item.htm?id=682202291873" target="_blank" rel="noopener noreferrer" style={{
          gridArea: 'main',
          background: '#FFE6EE',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <SafeIcon icon={Heart} size={48} style={{ color: '#FF6699' }} />
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#333' }}>逗豆鸟</h2>
          </div>
          <p style={{ fontSize: '16px', margin: '0 0 16px 0', fontWeight: '500', color: '#333' }}>
            经典入门款，2019年蝉联天猫所在类目 Top1，单品销售额破亿，百万女生口碑推荐。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SafeIcon icon={Zap} size={20} style={{ color: '#FF6699' }} />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>3档声波吮吸</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SafeIcon icon={Volume2} size={20} style={{ color: '#FF6699' }} />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>低于50分贝</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SafeIcon icon={Droplets} size={20} style={{ color: '#FF6699' }} />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>IPX6防水</span>
            </div>
          </div>
        </a>

        {/* 子卡片1 */}
        <div style={{
          gridArea: 'sub1',
          background: '#FFF0F5',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SafeIcon icon={Zap} size={28} style={{ color: '#FF6699' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>性能亮点</h3>
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>通体震动4档可调</li>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>8000+神经末梢刺激</li>
            <li style={{ fontSize: '16px' }}>双层FDA级硅胶材质</li>
          </ul>
        </div>

        {/* 子卡片2 */}
        <div style={{
          gridArea: 'sub2',
          background: '#FFF0F5',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SafeIcon icon={Lock} size={28} style={{ color: '#FF6699' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>贴心设计</h3>
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>安全锁防误触</li>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>电量提示红灯</li>
            <li style={{ fontSize: '16px' }}>一键启动操作简便</li>
          </ul>
        </div>

        {/* 子卡片3 */}
        <div style={{
          gridArea: 'sub3',
          background: '#FFF0F5',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SafeIcon icon={BatteryCharging} size={28} style={{ color: '#FF6699' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>配套设施</h3>
          </div>
          <p style={{ margin: '0', fontSize: '16px' }}>防尘收纳盒 + 充电底座 + 暖味氛围灯</p>
        </div>

        {/* 子卡片4 */}
        <div style={{
          gridArea: 'sub4',
          background: '#FFF0F5',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SafeIcon icon={Smile} size={28} style={{ color: '#FF6699' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>使用场景</h3>
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>工作日放松</li>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>浴室享受</li>
            <li style={{ fontSize: '16px' }}>伴侣共用/异地相思</li>
          </ul>
        </div>

        {/* 子卡片5 */}
        <div style={{
          gridArea: 'sub5',
          background: '#FFF0F5',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SafeIcon icon={Award} size={28} style={{ color: '#FF6699' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>设计荣誉</h3>
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>台湾金点设计奖</li>
            <li style={{ fontSize: '16px', marginBottom: '4px' }}>德国红点设计大奖</li>
            <li style={{ fontSize: '16px' }}>美国IDEA设计铜奖</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-09T14:24:29.294Z