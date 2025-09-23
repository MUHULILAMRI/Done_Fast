import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/components/cart-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "don_efast - Layanan Joki Akademik Terpercaya",
  description:
    "Kami siap membantu segala masalah anda. Layanan joki skripsi, program, jurnal, dan 3D modeling dengan kualitas terbaik.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <CartProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
