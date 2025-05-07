import './globals.css'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: '🍱 Bento Grid Maker',
  description: '便当卡片生成器',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}
