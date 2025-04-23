import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ToastProvider } from '@/components/ui/use-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My App",
  description: "Created with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
} 