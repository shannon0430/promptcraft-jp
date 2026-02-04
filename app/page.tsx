'use client'

import { useState } from 'react'

const PROMPT_TEMPLATES = [
  { id: 'business-email', label: 'ビジネスメール', icon: '📧', description: '敬語を使った丁寧なメール' },
  { id: 'blog-post', label: 'ブログ記事', icon: '📝', description: 'SEO対応の記事構成' },
  { id: 'sns-post', label: 'SNS投稿', icon: '📱', description: 'バズるTwitter/Instagram投稿' },
  { id: 'presentation', label: 'プレゼン資料', icon: '📊', description: '説得力のあるスライド構成' },
  { id: 'customer-support', label: 'カスタマー対応', icon: '💬', description: '丁寧なお客様対応文' },
  { id: 'creative', label: 'クリエイティブ', icon: '🎨', description: '自由な発想を引き出す' },
]

const TONE_OPTIONS = [
  { id: 'formal', label: '敬語・フォーマル' },
  { id: 'casual', label: 'カジュアル' },
  { id: 'friendly', label: 'フレンドリー' },
  { id: 'professional', label: 'プロフェッショナル' },
]

export default function Home() {
  const [intent, setIntent] = useState('')
  const [template, setTemplate] = useState('business-email')
  const [tone, setTone] = useState('formal')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generatePrompt = async () => {
    if (!intent.trim()) return
    
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, template, tone }),
      })
      
      const data = await response.json()
      setResult(data.prompt || 'エラーが発生しました')
    } catch (error) {
      setResult('接続エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PromptCraft
            </span>
            <span className="text-purple-300 text-2xl ml-2">JP</span>
          </h1>
          <p className="text-gray-300 text-lg">
            日本語に最適化されたAIプロンプトを瞬時に生成
          </p>
        </div>

        {/* Main Card */}
        <div className="glass rounded-2xl p-6 md:p-8 glow">
          {/* Template Selection */}
          <div className="mb-6">
            <label className="text-white font-medium mb-3 block">📋 テンプレート</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROMPT_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    template === t.id
                      ? 'bg-purple-500/50 border-purple-400 border-2'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-white text-sm font-medium">{t.label}</div>
                  <div className="text-gray-400 text-xs">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Intent Input */}
          <div className="mb-6">
            <label className="text-white font-medium mb-3 block">✨ やりたいこと</label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="例: 新商品の発売を告知するメールを書きたい"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Tone Selection */}
          <div className="mb-6">
            <label className="text-white font-medium mb-3 block">🎯 トーン</label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    tone === t.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePrompt}
            disabled={loading || !intent.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              loading || !intent.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中...
              </span>
            ) : (
              '🚀 プロンプトを生成'
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 rounded-xl bg-black/30 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-purple-300 font-medium">📎 生成されたプロンプト</span>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 rounded-lg bg-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/50 transition-all"
                >
                  {copied ? '✓ コピー完了' : '📋 コピー'}
                </button>
              </div>
              <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                {result}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Made with 💜 by Shannon</p>
        </div>
      </div>
    </main>
  )
}
