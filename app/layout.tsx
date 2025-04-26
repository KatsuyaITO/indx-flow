import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  // サイトの基本的なタイトル
  title: "INDX Flow - キャッシュフロー可視化 & JSON化ツール",
  // サイトの簡単な説明 (検索結果やSNS共有時に表示されやすい)
  description: "直感的なインターフェースでキャッシュフロー（収入、支出、予算、貯蓄など）の流れを視覚的にデザインし、JSONデータとしてエクスポートできる無料ツールです。",
  // Open Graph Protocol (Facebook, LinkedInなどでの共有時の設定)
  openGraph: {
    title: "INDX Flow | 簡単キャッシュフロー可視化ツール",
    description: "収入・支出・予算などのキャッシュフローを視覚的に設計し、JSONで簡単に出力。資金の流れを明確に把握できます。",
    // サイトの正式なURL
    url: "https://indx-flow.vercel.app/",
    // サイト名
    siteName: "INDX Flow",
    // 共有時に表示される画像 (!!!必ず適切な画像URLに差し替えてください!!!)
    images: [
      {
        // 例: OGP画像のURL (サイトのトップページや特徴を表す画像)
        url: "https://indx-flow.vercel.app/ogp.png", // !!!このURLは仮のものです。実際の画像URLに差し替えてください!!!
        width: 1200, // 推奨サイズ
        height: 630, // 推奨サイズ
        alt: "INDX Flow ツールでのキャッシュフロー可視化の例",
      },
    ],
    // サイトの言語
    locale: "ja_JP",
    // サイトの種類 (Webサイト)
    type: "website",
  },
  // Twitter Card (Twitterでの共有時の設定)
  twitter: {
    // カードの種類 (大きな画像付きサマリー)
    card: "summary_large_image",
    title: "INDX Flow - キャッシュフロー可視化 & JSON化ツール",
    description: "直感的なインターフェースでキャッシュフローの流れを視覚的にデザインし、JSONデータとしてエクスポートできる無料ツール。",
    images: ["https://indx-flow.vercel.app/ogp.png"], // !!!このURLは仮のものです。実際の画像URLに差し替えてください!!!
  },
  // 検索エンジン向けの設定
  robots: {
    index: true, // 検索結果にインデックスさせる
    follow: true, // ページ内のリンクを辿ることを許可する
    nocache: false, // キャッシュを許可する (通常はfalse)
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // 正規URLの指定 (URLの重複を避けるため)
  alternates: {
    canonical: "https://indx-flow.vercel.app/",
  },
  // keywords: ["キャッシュフロー", "可視化", "資金繰り", "家計管理", "プロジェクト管理", "フローチャート", "JSON", "ツール", "無料", "INDX Flow"], // キーワード (現在はSEO効果が低いとされる)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
