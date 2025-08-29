import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Navbar } from '@/components/layout/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alx Polly - Polling App',
  description: 'A modern polling application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-4 text-center text-sm text-muted-foreground">
            <div className="container mx-auto">
              © {new Date().getFullYear()} Alx Polly. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}