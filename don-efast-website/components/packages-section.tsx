"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, MessageCircle } from "lucide-react"

const packages = [
  {
    title: "Joki Penulisan",
    price: "Mulai Dari 250k",
    description: "Layanan penulisan akademik untuk berbagai jenis tugas dan makalah",
    features: ["Essay & Makalah", "Laporan Praktikum", "Review Jurnal", "Artikel Ilmiah", "Revisi 2x gratis"],
    popular: false,
  },
  {
    title: "Joki Skripsi",
    price: "Mulai Dari 1.9Jt",
    description: "Bantuan lengkap untuk penyelesaian skripsi dan thesis",
    features: [
      "Proposal Skripsi",
      "BAB 1-5 Lengkap",
      "Analisis Data",
      "Konsultasi Intensif",
      "Revisi",
      "Bimbingan presentasi",
    ],
    popular: true,
  },
  {
    title: "Joki Pembuatan Program",
    price: "Mulai dari 800k",
    description: "Solusi programming untuk berbagai bahasa dan platform",
    features: [
      "Website & Web App",
      "Mobile App",
      "Desktop Application",
      "Database Design",
      "Source code + dokumentasi",
      "Support & konsultasi",
    ],
    popular: false,
  },
]

export function PackagesSection() {
  return (
    <section id="paket" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Paket & Layanan Populer</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Pilih layanan yang sesuai dengan kebutuhan akademik Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative group hover:scale-105 transition-all duration-300 hover:shadow-xl animate-in slide-in-from-bottom duration-1000 ${
                pkg.popular ? "border-primary shadow-lg shadow-primary/20" : ""
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Paling Populer
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                <CardDescription className="text-muted-foreground">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  onClick={() => window.open("https://wa.me/6285998006060", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Order via WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
