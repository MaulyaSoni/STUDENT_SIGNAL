import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google'

import '@/lib/fontawesome'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EarlySignal.AI - Student Dropout Prediction',
  description: 'Predictive analytics dashboard for early intervention and student success',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#131313',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>{children}</body>
    </html>
  )
}
