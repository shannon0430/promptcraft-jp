import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PromptCraft JP - AIプロンプト最適化ツール',
  description: '日本語に特化したAIプロンプト生成ツール。敬語・ビジネス文書・コンテンツ作成をサポート。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
