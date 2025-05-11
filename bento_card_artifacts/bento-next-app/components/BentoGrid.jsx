'use client'

import { 
  BadgeInfo, 
  FileDigit, 
  Clock, 
  PercentSquare,
  Target,
  Lightbulb,
  Focus
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

export default function BentoGrid() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* First row */}
        <div className="col-span-3 bg-blue-50 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={FileDigit} size={48} className="text-blue-500 mx-auto mb-3" />
          <h2 className="font-semibold text-xl mb-2">The 80/20 Principle</h2>
          <p className="text-base">A powerful concept that helps prioritize efforts for maximum results</p>
        </div>

        {/* Second row */}
        <div className="col-span-2 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={PercentSquare} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Core Concept</h3>
          <p className="text-base">80% of results come from 20% of efforts</p>
        </div>
        
        <div className="col-span-1 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={Clock} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Time Efficiency</h3>
          <p className="text-base">Focus on high-impact tasks</p>
        </div>

        {/* Third row */}
        <div className="col-span-1 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={Target} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Precision</h3>
          <p className="text-base">Identify vital few activities</p>
        </div>
        
        <div className="col-span-1 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={Lightbulb} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Innovation</h3>
          <p className="text-base">Apply to problem-solving</p>
        </div>
        
        <div className="col-span-1 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={Focus} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Productivity</h3>
          <p className="text-base">Eliminate low-value work</p>
        </div>

        {/* Fourth row */}
        <div className="col-span-3 bg-blue-50/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon icon={BadgeInfo} size={32} className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Key Insight</h3>
          <p className="text-base">Success comes from identifying and focusing on the critical few rather than the trivial many</p>
        </div>
      </div>
    </div>
  )
}

// Generated at: 2025-05-11T14:31:06.319Z