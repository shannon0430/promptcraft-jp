# PromptCraft JP 🇯🇵

日本語に最適化されたAIプロンプト生成ツール。

## 特徴

- 🎯 **日本語特化**: 敬語、ビジネス文書、コンテンツ作成に最適化
- 📧 **6種類のテンプレート**: ビジネスメール、ブログ、SNS、プレゼン、カスタマー対応、クリエイティブ
- 🎨 **トーン選択**: フォーマル、カジュアル、フレンドリー、プロフェッショナル
- ⚡ **即時生成**: GPT-4o-miniで高速にプロンプトを生成

## 使い方

1. テンプレートを選択
2. やりたいことを入力
3. トーンを選択
4. 「プロンプトを生成」をクリック
5. 生成されたプロンプトをChatGPTにコピペ

## セットアップ

```bash
# インストール
npm install

# 環境変数を設定
cp .env.example .env.local
# OPENAI_API_KEYを設定

# 開発サーバー起動
npm run dev
```

## デプロイ

Vercelにワンクリックデプロイ：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shannon-0430/promptcraft-jp)

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o-mini)
- Vercel

## ライセンス

MIT

---

Made with 💜 by [Shannon](https://x.com/shannon_0430)
