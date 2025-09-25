"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Code,
  FileText,
  Microscope,
  Cable as Cube,
  Users,
  Clock,
  Shield,
  Star,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useCart } from "@/components/cart-provider"

const servicesData = {
  "joki-penulisan": {
    title: "Joki Penulisan",
    description: "Layanan penulisan akademik profesional untuk berbagai kebutuhan",
    price: "Mulai dari 250k",
    icon: FileText,
    category: "Academic",
    popular: false,
    deliveryTime: "3-5 hari",
    revisions: "2x revisi gratis",
    longDescription:
      "Kami menyediakan layanan penulisan akademik profesional yang membantu Anda menyelesaikan berbagai tugas penulisan dengan kualitas terbaik. Tim penulis berpengalaman kami siap membantu dari essay sederhana hingga paper penelitian yang kompleks.",
    features: [
      "Essay & Artikel berkualitas tinggi",
      "Makalah & Paper sesuai standar akademik",
      "Review Jurnal dengan analisis mendalam",
      "Proposal Penelitian yang komprehensif",
      "Laporan Praktikum detail dan akurat",
    ],
    process: [
      "Konsultasi kebutuhan dan brief",
      "Penelitian dan pengumpulan referensi",
      "Penulisan draft pertama",
      "Review dan revisi",
      "Finalisasi dan pengiriman",
    ],
    packages: [
      {
        name: "Basic",
        price: "250k",
        features: ["Essay/Artikel 1000-2000 kata", "3x revisi", "Referensi 10+ sumber", "Plagiarism check"],
      },
      {
        name: "Standard",
        price: "450k",
        features: [
          "Makalah 3000-5000 kata",
          "5x revisi",
          "Referensi 20+ sumber",
          "Format sesuai guideline",
          "Konsultasi",
        ],
      },
      {
        name: "Premium",
        price: "750k",
        features: [
          "Paper penelitian 5000+ kata",
          "Unlimited revisi",
          "Referensi 30+ sumber",
          "Analisis mendalam",
          "Konsultasi intensif",
        ],
      },
    ],
  },
  "joki-skripsi": {
    title: "Joki Skripsi S1",
    description: "Bantuan penyelesaian skripsi S1 dengan kualitas terbaik",
    price: "Mulai dari 900k",
    icon: BookOpen,
    category: "Academic",
    popular: true,
    deliveryTime: "2-4 minggu",
    revisions: "Revisi berkali-kali",
    longDescription:
      "Layanan bantuan penyelesaian skripsi khusus untuk mahasiswa S1. Kami membantu dari tahap proposal hingga sidang dengan pendampingan intensif dari konsultan berpengalaman.",
    features: [
      "Skripsi S1 semua jurusan",
      "Proposal & Bab 1-5 lengkap",
      "Analisis Data SPSS/R/Python",
    ],
    process: [
      "Konsultasi topik dan metodologi",
      "Penyusunan proposal penelitian",
      "Pengumpulan dan analisis data",
      "Penulisan bab per bab",
      "Persiapan sidang dan presentasi",
    ],
    packages: [
      {
        name: "Proposal Only",
        price: "900k",
        features: ["Bab 1-3 lengkap", "Metodologi penelitian", "Daftar pustaka", "Konsultasi"],
      },
      {
        name: "Full Skripsi",
        price: "2.5jt",
        features: ["Bab 1-5 lengkap", "Analisis data", "Revisi berkali-kali", "Bimbingan sidang", "Presentasi PPT"],
      },
      {
        name: "Premium Support",
        price: "3.5jt",
        features: [
          "Full skripsi + proposal",
          "Analisis statistik lanjutan",
          "Mock sidang",
          "Revisi pasca sidang",
          "Jurnal publikasi",
        ],
      },
    ],
  },
  "joki-program": {
    title: "Joki Pembuatan Program",
    description: "Pengembangan aplikasi dan sistem sesuai kebutuhan Anda",
    price: "Mulai dari 1.8jt",
    icon: Code,
    category: "Programming",
    popular: false,
    deliveryTime: "1-3 minggu",
    revisions: "Support & konsultasi",
    longDescription:
      "Layanan pengembangan aplikasi dan sistem yang komprehensif. Tim developer berpengalaman kami siap membantu membangun solusi teknologi sesuai kebutuhan Anda, dari website sederhana hingga aplikasi enterprise yang kompleks.",
    features: [
      "Website & Web App responsif",
      "Mobile App Android/iOS",
      "Desktop Application multi-platform",
      "Database Design & optimization",
      "API Development & integration",
    ],
    process: [
      "Analisis kebutuhan dan requirement",
      "Design UI/UX dan arsitektur sistem",
      "Development dan coding",
      "Testing dan quality assurance",
      "Deployment dan maintenance",
    ],
    packages: [
      {
        name: "Web Basic",
        price: "1.5jt",
        features: ["Website statis/landing page", "Responsive design", "Basic SEO", "Hosting setup"],
      },
      {
        name: "Web App",
        price: "3jt",
        features: [
          "Web aplikasi dinamis",
          "Database integration",
          "User authentication",
          "Admin panel",
          "API endpoints",
        ],
      },
      {
        name: "Full Stack",
        price: "7jt",
        features: [
          "Web + Mobile app",
          "Advanced features",
          "Real-time functionality",
          "Payment gateway",
          "Analytics dashboard",
        ],
      },
    ],
  },
  "joki-jurnal": {
    title: "Joki Jurnal Ilmiah",
    description: "Penulisan dan publikasi jurnal ilmiah berkualitas tinggi",
    price: "Mulai dari 1jt",
    icon: Microscope,
    category: "Academic",
    popular: false,
    deliveryTime: "2-6 minggu",
    revisions: "5x revisi gratis",
    longDescription:
      "Layanan penulisan jurnal ilmiah profesional dengan standar internasional. Kami membantu peneliti dan akademisi untuk mempublikasikan karya ilmiah di jurnal nasional dan internasional bereputasi.",
    features: [
      "Jurnal Nasional terakreditasi",
      "Jurnal Internasional bereputasi",
      "Review & Editing mendalam",
      "Bantuan Publikasi dan submission",
      "Citation Management profesional",
    ],
    process: [
      "Konsultasi topik dan target jurnal",
      "Literature review dan gap analysis",
      "Penulisan artikel sesuai template",
      "Peer review dan revisi",
      "Submission dan follow-up",
    ],
    packages: [
      {
        name: "Nasional",
        price: "1.2jt",
        features: ["Artikel jurnal nasional", "Template sesuai jurnal", "5x revisi", "Bantuan submission"],
      },
      {
        name: "Internasional",
        price: "2.5jt",
        features: [
          "Artikel jurnal internasional",
          "English proofreading",
          "Unlimited revisi",
          "Submission support",
          "Response to reviewer",
        ],
      },
      {
        name: "Premium",
        price: "4jt",
        features: [
          "Multiple journal options",
          "Guaranteed acceptance",
          "Full publication support",
          "Citation tracking",
          "Impact factor analysis",
        ],
      },
    ],
  },
  "joki-3d": {
    title: "Joki 3D Modeling",
    description: "Pembuatan model 3D profesional untuk berbagai keperluan",
    price: "Mulai dari 1.5jt",
    icon: Cube,
    category: "Design",
    popular: false,
    deliveryTime: "5-10 hari",
    revisions: "2x revisi gratis",
    longDescription:
      "Layanan pembuatan model 3D profesional untuk berbagai kebutuhan industri dan akademik. Tim designer berpengalaman kami menggunakan software terdepan untuk menghasilkan model 3D berkualitas tinggi.",
    features: [
      "Architectural 3D visualization",
      "Product Modeling detail",
      "Character Design & rigging",
      "Animation & motion graphics",
      "Rendering fotorealistik",
    ],
    process: [
      "Brief dan konsep design",
      "Sketching dan wireframe",
      "3D modeling dan texturing",
      "Lighting dan rendering",
      "Final output dan delivery",
    ],
    packages: [
      {
        name: "Basic Model",
        price: "500k",
        features: ["Simple 3D model", "Basic texturing", "3x revisi", "Standard resolution"],
      },
      {
        name: "Detailed Model",
        price: "1jt",
        features: ["Complex 3D model", "Advanced texturing", "Lighting setup", "5x revisi", "High resolution"],
      },
      {
        name: "Full Production",
        price: "2jt",
        features: ["Multiple models", "Animation ready", "Photorealistic rendering", "Unlimited revisi", "4K output"],
      },
    ],
  },
  konsultasi: {
    title: "Konsultasi Akademik",
    description: "Bimbingan dan konsultasi untuk berbagai kebutuhan akademik",
    price: "Mulai dari 150k",
    icon: Users,
    category: "Consultation",
    popular: false,
    deliveryTime: "1-2 hari",
    revisions: "Unlimited chat",
    longDescription:
      "Layanan konsultasi akademik personal untuk membantu Anda mengatasi berbagai tantangan dalam perjalanan akademik. Konsultan berpengalaman kami siap memberikan guidance dan solusi terbaik.",
    features: [
      "Konsultasi 1-on-1 personal",
      "Review Dokumen mendalam",
      "Guidance & Tips praktis",
      "Q&A Session interaktif",
      "Follow-up Support berkelanjutan",
    ],
    process: [
      "Assessment kebutuhan konsultasi",
      "Penjadwalan sesi konsultasi",
      "Sesi konsultasi intensif",
      "Action plan dan recommendations",
      "Follow-up dan monitoring",
    ],
    packages: [
      {
        name: "Single Session",
        price: "150k",
        features: ["1 sesi konsultasi (1 jam)", "Q&A unlimited", "Written summary", "Follow-up chat"],
      },
      {
        name: "Weekly Package",
        price: "500k",
        features: ["4 sesi konsultasi", "Priority support", "Document review", "Progress tracking"],
      },
      {
        name: "Monthly Support",
        price: "1.5jt",
        features: [
          "Unlimited konsultasi",
          "24/7 chat support",
          "Document review unlimited",
          "Personal academic mentor",
        ],
      },
    ],
  },
}

interface ServiceDetailPageProps {
  params: {
    slug: string
  }
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = servicesData[params.slug as keyof typeof servicesData]
  const { addToCart } = useCart()

  if (!service) {
    notFound()
  }

  const IconComponent = service.icon

  const handleAddToCart = async (packageData: any) => {
    await addToCart({
      id: `${params.slug}-${packageData.name.toLowerCase()}`,
      serviceId: params.slug,
      serviceName: service.title,
      packageName: packageData.name,
      price: packageData.price,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-coral-500 hover:text-coral-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Layanan
          </Link>

          <div className="flex items-start gap-6 mb-8">
            <div className="p-4 bg-coral-500/20 rounded-xl">
              <IconComponent className="w-12 h-12 text-coral-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{service.title}</h1>
                {service.popular && (
                  <Badge className="bg-coral-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-xl text-slate-300 mb-6">{service.description}</p>
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{service.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{service.revisions}</span>
                </div>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {service.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Deskripsi Layanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-lg leading-relaxed">{service.longDescription}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Yang Anda Dapatkan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-coral-500 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Process */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Proses Pengerjaan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-coral-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Packages */}
              <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Paket Harga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {service.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className="border border-slate-600 rounded-lg p-4 hover:border-coral-500 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-white">{pkg.name}</h4>
                        <span className="text-coral-500 font-bold text-lg">{pkg.price}</span>
                      </div>
                      <div className="space-y-2">
                        {pkg.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-1.5 h-1.5 bg-coral-500 rounded-full flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4 bg-slate-600" />
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleAddToCart(pkg)}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                          variant="outline"
                        >
                          Tambah ke Keranjang
                        </Button>
                        <Link
                          href={`https://wa.me/6285998006060?text=Halo, saya tertarik dengan paket ${pkg.name} untuk layanan ${service.title}`}
                        >
                          <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Pesan {pkg.name}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="bg-gradient-to-br from-coral-500/20 to-coral-600/20 border-coral-500/30">
                <CardContent className="p-6 text-center">
                  <h3 className="text-white font-semibold text-lg mb-2">Butuh Konsultasi?</h3>
                  <p className="text-slate-300 text-sm mb-4">Diskusikan kebutuhan Anda dengan tim kami</p>
                  <Link href="https://wa.me/6285998006060?text=Halo, saya ingin konsultasi tentang layanan yang tersedia">
                    <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat Sekarang
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
