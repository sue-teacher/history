export const metadata = {
  title: '역사 모의토론',
  description: 'AI 역사 모의토론 웹 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}