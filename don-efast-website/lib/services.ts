"use client"

import {
  BookOpen,
  Code,
  FileText,
  Microscope,
  Cable as Cube,
  Users,
} from "lucide-react"

import { LucideIcon } from "lucide-react"

export type SubOption = {
  id: string
  name: string
  price: number
  features: string[]
}

export type Service = {
  id: string
  title: string
  description: string
  price?: number
  icon: LucideIcon
  category: string
  popular: boolean
  features: string[]
  deliveryTime: string
  revisions: string
  subOptions?: SubOption[]
}

export const services: Service[] = [
  {
    id: "joki-penulisan",
    title: "Joki Penulisan",
    description: "Layanan penulisan akademik profesional untuk berbagai kebutuhan",
    price: 250000,
    icon: FileText,
    category: "Academic",
    popular: false,
    features: ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"],
    deliveryTime: "3-7 hari",
    revisions: "3x revisi gratis",
    subOptions: [
      {
        id: "penulisan-standar",
        name: "Paket Standar",
        price: 250000,
        features: ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"],
      },
    ],
  },
  {
    id: "joki-skripsi",
    title: "Joki Skripsi",
    description: "Bantuan penyelesaian skripsi S1 dengan kualitas terbaik",
    icon: BookOpen,
    category: "Academic",
    popular: true,
    features: ["Skripsi S1", "Proposal & Bab 1-5", "Analisis Data SPSS/R"],
    deliveryTime: "2-4 minggu",
    revisions: "Revisi 4 kali",
    price: 300000,
    subOptions: [
      {
        id: "skripsi-bab1-3",
        name: "Bab 1 - 3 Saja",
        price: 900000,
        features: ["Bab 1", "Bab 2", "Bab 3"],
      },
      {
        id: "skripsi-bab4-5",
        name: "Bab 4 - 5 + Free PPT",
        price: 1800000,
        features: ["Bab 4", "Bab 5", "Free Pembuatan PPT"],
      },
      {
        id: "skripsi-full",
        name: "Full Bab",
        price: 2900000,
        features: ["Bab 1-5 Lengkap", "Bimbingan Penuh", "Gratis Presentasi PPT"],
      },
    ],
  },
  {
    id: "joki-program",
    title: "Joki Pembuatan Program",
    description: "Pengembangan aplikasi dan sistem sesuai kebutuhan Anda",
    price: 1500000,
    icon: Code,
    category: "Programming",
    popular: false,
    features: ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"],
    deliveryTime: "1-3 minggu",
    revisions: "Support & konsultasi",
    subOptions: [
      {
        id: "program-standar",
        name: "Paket Standar",
        price: 1500000,
        features: ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"],
      },
    ],
  },
  {
    id: "joki-jurnal",
    title: "Joki Jurnal Ilmiah",
    description: "Penulisan dan publikasi jurnal ilmiah berkualitas tinggi",
    price: 200000,
    icon: Microscope,
    category: "Academic",
    popular: false,
    features: [
      "Jurnal Nasional / Internasional",
      "Review & Editing Profesional",
      "Bantuan & Strategi Publikasi",
      "Manajemen Sitasi",
    ],
    deliveryTime: "2-6 minggu",
    revisions: "5x revisi gratis",
    subOptions: [
      {
        id: "jurnal-penulisan",
        name: "Joki Penulisan Saja",
        price: 200000,
        features: ["Penulisan draf jurnal", "Struktur sesuai standar", "Referensi dasar"],
      },
      {
        id: "jurnal-lengkap",
        name: "Paket Lengkap (Penulisan & Bantuan Publikasi)",
        price: 1200000,
        features: ["Semua fitur penulisan", "Analisis & editing mendalam", "Bantuan submisi ke jurnal target"],
      },
    ],
  },
  {
    id: "joki-3d",
    title: "Joki 3D Modeling",
    description: "Pembuatan model 3D profesional untuk berbagai keperluan",
    price: 1800000,
    icon: Cube,
    category: "Design",
    popular: false,
    features: ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"],
    deliveryTime: "5-10 hari",
    revisions: "3x revisi gratis",
    subOptions: [
      {
        id: "3d-standar",
        name: "Paket Standar",
        price: 1800000,
        features: ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"],
      },
    ],
  },
  {
    id: "konsultasi",
    title: "Konsultasi Akademik",
    description: "Bimbingan dan konsultasi untuk berbagai kebutuhan akademik",
    price: 150000,
    icon: Users,
    category: "Consultation",
    popular: false,
    features: ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"],
    deliveryTime: "1-2 hari",
    revisions: "Unlimited chat",
    subOptions: [
      {
        id: "konsultasi-standar",
        name: "Sesi Konsultasi",
        price: 150000,
        features: ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"],
      },
    ],
  },
]

export const categories = ["All", "Academic", "Programming", "Design", "Consultation"]