import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CTM Thika Land Surveyors | Professional Land Survey Services in Kenya',
  description: 'Professional land surveying services in Thika, Kenya. Property surveys, plot booking, mutation forms, and more. Licensed & registered surveyors. Call us today!',
  openGraph: {
    title: 'CTM Thika Land Surveyors | Professional Land Survey Services',
    description: 'Professional land surveying services in Thika, Kenya. Property surveys, plot booking, mutation forms, and more.',
    url: 'https://ctm-thika-land-surveyors.vercel.app',
    siteName: 'CTM Thika Land Surveyors',
    type: 'website',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTM Thika Land Surveyors | Professional Land Survey Services',
    description: 'Professional land surveying services in Thika, Kenya. Property surveys, plot booking, mutation forms, and more.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
