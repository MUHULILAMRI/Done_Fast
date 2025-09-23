"use client"

import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => window.open("https://wa.me/6285998006060", "_blank")}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 pulse-glow"
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
