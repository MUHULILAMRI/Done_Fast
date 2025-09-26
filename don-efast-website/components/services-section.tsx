"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Code, BookOpen, PenTool, Cable as Cube, Users } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Joki Skripsi",
    description:
      "Bantuan penulisan skripsi, thesis, dan disertasi dengan metodologi yang tepat dan referensi terpercaya.",
  },
  {
    icon: PenTool,
    title: "Joki Rapikan Penulisan",
    description: "Perbaikan format, tata bahasa, dan struktur penulisan sesuai standar akademik yang berlaku.",
  },
  {
    icon: Code,
    title: "Joki Program",
    description: "Pembuatan aplikasi, website, dan sistem informasi dengan berbagai bahasa pemrograman.",
  },
  {
    icon: BookOpen,
    title: "Joki Pembuatan Jurnal",
    description: "Penulisan artikel jurnal ilmiah dengan standar publikasi nasional dan internasional.",
  },
  {
    icon: Cube,
    title: "Joki Gambar & 3D Modeling",
    description: "Desain grafis, modeling 3D, dan visualisasi untuk keperluan presentasi dan publikasi.",
  },
  {
    icon: Users,
    title: "Dan Lainnya",
    description:
      "Berbagai layanan akademik lainnya sesuai kebutuhan Anda. Konsultasi gratis untuk menentukan solusi terbaik.",
  },
]

export function ServicesSection() {
  return (
    <section id="jasa" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Utama</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Kami menyediakan berbagai layanan akademik profesional untuk membantu kesuksesan studi Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-in slide-in-from-bottom duration-1000"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
