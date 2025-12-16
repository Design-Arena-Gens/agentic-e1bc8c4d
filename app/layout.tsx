import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ecofy Solar - Dealer Onboarding Portal',
  description: 'Streamlined dealer onboarding automation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
