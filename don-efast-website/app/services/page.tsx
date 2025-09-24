"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Code,
  FileText,
  Microscope,
  Cable as Cube,
  Star,
  Clock,
  Shield,
  Users,
  Search,
  ShoppingCart,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"

const services = [
  {
    id: "joki-penulisan",
    title: "Joki Penulisan",
    description: "Layanan penulisan akademik profesional untuk berbagai kebutuhan",
    price: "Mulai dari 250k",
    icon: FileText,
    category: "Academic",
    popular: false,
    features: ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"],
    deliveryTime: "3-7 hari",
    revisions: "3x revisi gratis",
  },
  {
    id: "joki-skripsi",
    title: "Joki Skripsi",
    description: "Bantuan penyelesaian skripsi, tesis, dan disertasi dengan kualitas terbaik",
    price: "Mulai dari 900k",
    icon: BookOpen,
    category: "Academic",
    popular: true,
    features: ["Skripsi S1", "Proposal & Bab 1-5", "Analisis Data SPSS/R"],
    deliveryTime: "2-4 minggu",
    revisions: "Revisi 4 kali",
  },
  {
    id: "joki-program",
    title: "Joki Pembuatan Program",
    description: "Pengembangan aplikasi dan sistem sesuai kebutuhan Anda",
    price: "Mulai dari 1.5jt",
    icon: Code,
    category: "Programming",
    popular: false,
    features: ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"],
    deliveryTime: "1-3 minggu",
    revisions: "Support & konsultasi",
  },
  {
    id: "joki-jurnal",
    title: "Joki Jurnal Ilmiah",
    description: "Penulisan dan publikasi jurnal ilmiah berkualitas tinggi",
    price: "Mulai dari 1.2jt",
    icon: Microscope,
    category: "Academic",
    popular: false,
    features: [
      "Jurnal Nasional",
      "Jurnal Internasional",
      "Review & Editing",
      "Bantuan Publikasi",
      "Citation Management",
    ],
    deliveryTime: "2-6 minggu",
    revisions: "5x revisi gratis",
  },
  {
    id: "joki-3d",
    title: "Joki 3D Modeling",
    description: "Pembuatan model 3D profesional untuk berbagai keperluan",
    price: "Mulai dari 1.8jt",
    icon: Cube,
    category: "Design",
    popular: false,
    features: ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"],
    deliveryTime: "5-10 hari",
    revisions: "3x revisi gratis",
  },
  {
    id: "konsultasi",
    title: "Konsultasi Akademik",
    description: "Bimbingan dan konsultasi untuk berbagai kebutuhan akademik",
    price: "Mulai dari 150k",
    icon: Users,
    category: "Consultation",
    popular: false,
    features: ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"],
    deliveryTime: "1-2 hari",
    revisions: "Unlimited chat",
  },
]

const categories = ["All", "Academic", "Programming", "Design", "Consultation"]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { addToCart } = useCart()

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const getCategoryCount = (category: string) => {
    if (category === "All") return services.length
    return services.filter((service) => service.category === category).length
  }

  const handleQuickAddToCart = (service: any) => {
    addToCart({
      id: `${service.id}-basic`,
      name: `${service.title} - Basic Package`,
      get name() {
        return this._name
      },
      set name(value) {
        this._name = value
      },
      price: service.price,
      service: service.title,
      package: "Basic Package",
      features: service.features.slice(0, 3), // First 3 features for basic package
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Semua <span className="text-coral-500">Layanan</span> Kami
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto text-pretty">
            Pilih layanan yang sesuai dengan kebutuhan Anda. Kami menyediakan solusi lengkap untuk semua masalah
            akademik dan teknis.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={
                  category === selectedCategory
                    ? "bg-coral-500 hover:bg-coral-600 text-white border-coral-500"
                    : "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300 text-xs">
                  {getCategoryCount(category)}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-400">
              Menampilkan {filteredServices.length} layanan
              {selectedCategory !== "All" && ` dalam kategori ${selectedCategory}`}
              {searchQuery && ` untuk "${searchQuery}"`}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const IconComponent = service.icon
                return (
                  <Card
                    key={service.id}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group hover:scale-105"
                  >
                    <CardHeader className="relative">
                      {service.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-coral-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-coral-500/20 rounded-lg">
                          <IconComponent className="w-6 h-6 text-coral-500" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                          <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-slate-300 text-base">{service.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-coral-500 mb-2">{service.price}</div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-coral-500 rounded-full flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Service Info */}
                      <div className="flex justify-between text-sm text-slate-400 pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{service.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>{service.revisions}</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-3 pt-4">
                        <Button
                          onClick={() => handleQuickAddToCart(service)}
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Tambah ke Keranjang
                        </Button>
                        <div className="flex gap-3">
                          <Link href={`/services/${service.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white bg-transparent"
                            >
                              Detail Paket
                            </Button>
                          </Link>
                          <Link
                            href={`https://wa.me/6285998006060?text=Halo, saya tertarik dengan layanan ${service.title}`}
                            className="flex-1"
                          >
                            <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                              Pesan Sekarang
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-slate-400 text-lg mb-4">Tidak ada layanan yang ditemukan</div>
                <p className="text-slate-500 mb-6">Coba ubah kategori atau kata kunci pencarian Anda</p>
                <Button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSearchQuery("")
                  }}
                  className="bg-coral-500 hover:bg-coral-600 text-white"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
