"use client"

import { Search, ClipboardList, MessageCircle, Rocket } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Pilih Layanan",
    description: "Jelajahi berbagai layanan yang kami tawarkan dan pilih paket yang paling sesuai dengan kebutuhan Anda.",
  },
  {
    icon: ClipboardList,
    title: "Isi Informasi Anda",
    description: "Klik \"Tambah ke Keranjang\", lalu isi nama dan nomor WhatsApp Anda pada form yang muncul.",
  },
  {
    icon: MessageCircle,
    title: "Konfirmasi via WhatsApp",
    description: "Tim admin kami akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi detail pesanan dan instruksi pembayaran.",
  },
  {
    icon: Rocket,
    title: "Pesanan Diproses",
    description: "Setelah pembayaran dikonfirmasi, kami akan langsung memulai pengerjaan pesanan Anda dan memberikan update secara berkala.",
  },
]

export function HowToOrderSection() {
  return (
    <section id="cara-pesan" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Mudah Memesan di Done Fast</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Hanya dengan beberapa langkah sederhana, kebutuhan Anda akan segera kami proses.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* The connecting line - visible on md and up */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-700">
            <svg width="100%" height="100%" className="absolute top-0 left-0">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
            </svg>
          </div>

          <div className="grid md:grid-cols-4 gap-y-12 md:gap-x-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-10 duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Indicator */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-slate-900 rounded-full border-2 border-slate-700">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-800 rounded-full">
                      <step.icon className="w-10 h-10 text-coral-500" />
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center bg-coral-500 text-white font-bold text-lg rounded-full border-4 border-slate-950">
                    {index + 1}
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}