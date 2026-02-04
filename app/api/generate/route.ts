import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }
  return openai
}

const TEMPLATE_PROMPTS: Record<string, string> = {
  'business-email': `あなたは日本のビジネスメール作成の専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- 適切な敬語表現を使用
- ビジネスメールの基本構成（挨拶、本文、結び）を含む
- 相手への配慮を示す表現を使用`,

  'blog-post': `あなたはSEOに強い日本語ブログ記事の専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- 検索エンジンに最適化された構成
- 読者を引き込む見出し構成
- 日本人読者に響く表現`,

  'sns-post': `あなたは日本のSNSマーケティングの専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- Twitter/Instagram向けの最適な文字数
- バズりやすい表現
- 適切なハッシュタグ提案`,

  'presentation': `あなたはプレゼンテーション資料作成の専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- 説得力のあるストーリー構成
- 日本のビジネス文化に適した表現
- 具体的なスライド構成案`,

  'customer-support': `あなたは日本のカスタマーサポートの専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- お客様への丁寧な対応
- 問題解決に向けた明確な説明
- クレーム対応時の適切な表現`,

  'creative': `あなたはクリエイティブライティングの専門家です。
以下の要件に基づいて、ChatGPTに渡す最適なプロンプトを生成してください。
- 創造性を最大限に引き出す指示
- 日本語の美しい表現
- ユニークな視点の提案`,
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  'formal': '敬語（です・ます調）を使用し、フォーマルなトーンで',
  'casual': 'カジュアルな口語体で、親しみやすいトーンで',
  'friendly': 'フレンドリーで温かみのあるトーンで',
  'professional': 'プロフェッショナルで信頼感のあるトーンで',
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const { intent, template, tone } = await request.json()

    if (!intent) {
      return NextResponse.json({ error: '内容を入力してください' }, { status: 400 })
    }

    const templatePrompt = TEMPLATE_PROMPTS[template] || TEMPLATE_PROMPTS['business-email']
    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['formal']

    const systemPrompt = `${templatePrompt}

トーンの指定: ${toneInstruction}

重要なルール:
1. 生成するのは「ChatGPTへのプロンプト」であり、最終的なコンテンツではありません
2. プロンプトは日本語で、具体的かつ明確に記述してください
3. AIが高品質な出力を生成できるよう、詳細な指示を含めてください
4. 出力形式や制約条件も明記してください`

    const userMessage = `以下の目的のためのChatGPTプロンプトを生成してください：

目的: ${intent}

生成するプロンプトには以下を含めてください：
- 具体的なタスクの説明
- 期待する出力形式
- トーンや文体の指定
- 必要に応じた制約条件`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const generatedPrompt = completion.choices[0]?.message?.content || 'プロンプトの生成に失敗しました'

    return NextResponse.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
