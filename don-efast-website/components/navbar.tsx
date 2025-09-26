"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CartSidebar } from "./cart-sidebar"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHomepage = pathname === "/"

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/90 backdrop-blur-md border-b border-slate-700" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpeg-8SlpQUqMM0vkV6mfz6FFsPDFznBKfe.png"
                alt="don_efast logo"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-white">DONE FAST</h1>
                <p className="text-sm text-slate-300">joki cepat anti repot</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${pathname === "/" ? "text-coral-500" : "text-white hover:text-coral-500"}`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`transition-colors ${
                pathname.startsWith("/services") ? "text-coral-500" : "text-white hover:text-coral-500"
              }`}
            >
              Layanan
            </Link>
            {isHomepage ? (
              <>
                <a href="#jasa" className="text-white hover:text-coral-500 transition-colors">
                  Jasa
                </a>
                <a href="#paket" className="text-white hover:text-coral-500 transition-colors">
                  Paket
                </a>
                <a href="#kontak" className="text-white hover:text-coral-500 transition-colors">
                  Kontak
                </a>
              </>
            ) : (
              <>
                <Link href="/#layanan" className="text-white hover:text-coral-500 transition-colors">
                  Layanan
                </Link>
                <Link href="/#paket" className="text-white hover:text-coral-500 transition-colors">
                  Paket
                </Link>
                <Link href="/#kontak" className="text-white hover:text-coral-500 transition-colors">
                  Kontak
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              <CartSidebar />
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 bg-transparent"
                onClick={() => window.open("https://wa.me/6285998006060", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                onClick={() => window.open("https://instagram.com/don_efast", "_blank")}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className={`transition-colors ${
                  pathname === "/" ? "text-coral-500" : "text-white hover:text-coral-500"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`transition-colors ${
                  pathname.startsWith("/services") ? "text-coral-500" : "text-white hover:text-coral-500"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Semua Layanan
              </Link>
              {isHomepage ? (
                <>
                  <a
                    href="#layanan"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Layanan
                  </a>
                  <a
                    href="#paket"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Paket
                  </a>
                  <a
                    href="#kontak"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kontak
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/#layanan"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Layanan
                  </Link>
                  <Link
                    href="/#paket"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Paket
                  </Link>
                  <Link
                    href="/#kontak"
                    className="text-white hover:text-coral-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kontak
                  </Link>
                </>
              )}

              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700">
                <div className="flex justify-start">
                  <CartSidebar />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 justify-start bg-transparent"
                  onClick={() => {
                    window.open("https://wa.me/6285998006060", "_blank")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 justify-start"
                  onClick={() => {
                    window.open("https://instagram.com/don_efast", "_blank")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
