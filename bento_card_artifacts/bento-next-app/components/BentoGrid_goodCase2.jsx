'use client'

"use client";

import React from "react";
import { 
  BadgeInfo, 
  Leaf, 
  Heart, 
  Sparkles, 
  RefreshCw, 
  Activity,
  Coffee, 
  Home, 
  Users
} from "lucide-react";

// SafeIcon: if failed, use BadgeInfo as fallback
const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  // 首先检查图标是否未定义
  if (!Icon) {
    console.warn(`Icon is undefined, using fallback`);
    return <Fallback {...props} />;
  }
  
  try {
    return <Icon {...props} />;
  } catch (error) {
    console.warn(`Icon rendering failed, using fallback icon`, error);
    return <Fallback {...props} />;
  }
};

export default function NagomiBentoGrid() {
  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ background: "#fefefe" }}>
      <h1 className="text-3xl font-bold mb-6 text-teal-700">🪷「和み」Nagomi：内在安宁的艺术</h1>
      
      <div className="grid grid-cols-12 gap-4">
        {/* Main card */}
        <div className="col-span-12 bg-teal-50 p-6 rounded-2xl shadow-sm flex flex-col items-center">
          <SafeIcon icon={Leaf} size={48} className="text-teal-500 mb-3" />
          <h2 className="text-xl font-bold text-teal-700 mb-2 text-center">「和み」本质</h2>
          <p className="text-teal-800 text-center">
            温和安宁的状态转变 · 从刚到柔的情绪调和 · 内外和谐的生活哲学
          </p>
        </div>
        
        {/* Secondary cards */}
        <div className="col-span-6 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Heart} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">字源与语感</h3>
          <p className="text-teal-800 text-sm">
            源自"和む"(nagomu) · 冰雪消融 · 刀锋钝化 · 心绪松弛 · 发音如深呼吸
          </p>
        </div>
        
        <div className="col-span-6 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Sparkles} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">身心体验</h3>
          <p className="text-teal-800 text-sm">
            皮质醇下降 · α波上升 · 副交感神经激活 · 五感和谐共存 · 感官舒适阈值
          </p>
        </div>
        
        <div className="col-span-4 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={RefreshCw} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">社会功能</h3>
          <p className="text-teal-800 text-sm">
            集体润滑剂 · 消解等级张力 · 促进自然交流
          </p>
        </div>
        
        <div className="col-span-4 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Coffee} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">茶道精髓</h3>
          <p className="text-teal-800 text-sm">
            水声作底鼓 · 时空调频 · 侘寂美学 · 感官同步共振
          </p>
        </div>
        
        <div className="col-span-4 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Activity} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">核心洞见</h3>
          <p className="text-teal-800 text-sm">
            非排除冲突 · 是调和再均衡 · 主动创造 · 张力转化
          </p>
        </div>
        
        <div className="col-span-6 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Home} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">物质体现</h3>
          <p className="text-teal-800 text-sm">
            茶室躙口设计 · 榻榻米触感 · 和纸漫反射 · 枯山水布局 · 怀石料理五味平衡
          </p>
        </div>
        
        <div className="col-span-6 bg-teal-50/70 p-5 rounded-2xl">
          <SafeIcon icon={Users} size={32} className="text-teal-500 mb-2" />
          <h3 className="font-bold text-teal-700 mb-1">现代应用</h3>
          <p className="text-teal-800 text-sm">
            疗愈经济 · 压力管理 · 和み经营企业哲学 · 日常微和み实践 · 工作生活平衡设计
          </p>
        </div>
      </div>
      
      <p className="text-xs text-teal-600 mt-6 text-center">
        和み：将锋利转为圆润，将紧张化为舒缓，将对立融为和谐
      </p>
    </div>
  );
}

// Generated at: 2025-05-09T16:27:24.001Z