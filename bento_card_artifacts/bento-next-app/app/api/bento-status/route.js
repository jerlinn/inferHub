import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const statusPath = path.join(process.cwd(), 'components', '.bento-status.json')
    
    // 如果状态文件不存在，返回未生成
    if (!fs.existsSync(statusPath)) {
      return NextResponse.json(
        { generated: false },
        { 
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }
    
    // 读取状态文件
    const statusContent = fs.readFileSync(statusPath, 'utf8')
    const statusData = JSON.parse(statusContent)
    
    // 检查 Bento Grid 组件文件是否存在
    const bentoGridPath = path.join(process.cwd(), 'components', 'BentoGrid.jsx')
    const fileExists = fs.existsSync(bentoGridPath)
    
    // 读取文件修改时间
    const fileStats = fileExists ? fs.statSync(bentoGridPath) : null
    const fileModified = fileStats ? fileStats.mtime.toISOString() : null
    
    return NextResponse.json(
      {
        generated: statusData.generated && fileExists,
        timestamp: statusData.timestamp,
        fileModified: fileModified, // 添加文件修改时间
        refreshTime: new Date().toISOString() // 添加当前时间，用于验证缓存刷新
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
    
  } catch (error) {
    console.error('检查 Bento 状态失败:', error)
    
    return NextResponse.json(
      { error: `检查失败: ${error.message}`, generated: false },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
} 