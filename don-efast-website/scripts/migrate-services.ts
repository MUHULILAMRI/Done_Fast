import { createClient } from '@supabase/supabase-js';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';

// Configure dotenv to load variables from .env.local
dotenvConfig({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const servicesData = [
  {
    id: 'joki-penulisan',
    title: 'Joki Penulisan',
    description: 'Layanan penulisan akademik profesional untuk berbagai kebutuhan',
    price: 250000,
    icon: 'FileText',
    category: 'Academic',
    popular: false,
    features: ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"],
    delivery_time: '3-7 hari',
    revisions: '3x revisi gratis',
    sub_options: [{"id": "penulisan-standar", "name": "Paket Standar", "price": 250000, "features": ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"]}],
  },
  {
    id: 'joki-skripsi',
    title: 'Joki Skripsi',
    description: 'Bantuan penyelesaian skripsi S1 dengan kualitas terbaik',
    price: 300000,
    icon: 'BookOpen',
    category: 'Academic',
    popular: true,
    features: ["Skripsi S1", "Proposal & Bab 1-5", "Analisis Data SPSS/R"],
    delivery_time: '2-4 minggu',
    revisions: 'Revisi 4 kali',
    sub_options: [{"id": "skripsi-bab1-3", "name": "Bab 1 - 3 Saja", "price": 900000, "features": ["Bab 1", "Bab 2", "Bab 3"]}, {"id": "skripsi-bab4-5", "name": "Bab 4 - 5 + Free PPT", "price": 1800000, "features": ["Bab 4", "Bab 5", "Free Pembuatan PPT"]}, {"id": "skripsi-full", "name": "Full Bab", "price": 2900000, "features": ["Bab 1-5 Lengkap", "Bimbingan Penuh", "Gratis Presentasi PPT"]}],
  },
  {
    id: 'joki-program',
    title: 'Joki Pembuatan Program',
    description: 'Pengembangan aplikasi dan sistem sesuai kebutuhan Anda',
    price: 1500000,
    icon: 'Code',
    category: 'Programming',
    popular: false,
    features: ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"],
    delivery_time: '1-3 minggu',
    revisions: 'Support & konsultasi',
    sub_options: [{"id": "program-standar", "name": "Paket Standar", "price": 1500000, "features": ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"]}],
  },
  {
    id: 'joki-jurnal',
    title: 'Joki Jurnal Ilmiah',
    description: 'Penulisan dan publikasi jurnal ilmiah berkualitas tinggi',
    price: 200000,
    icon: 'Microscope',
    category: 'Academic',
    popular: false,
    features: ["Jurnal Nasional / Internasional", "Review & Editing Profesional", "Bantuan & Strategi Publikasi", "Manajemen Sitasi"],
    delivery_time: '2-6 minggu',
    revisions: '5x revisi gratis',
    sub_options: [{"id": "jurnal-penulisan", "name": "Joki Penulisan Saja", "price": 200000, "features": ["Penulisan draf jurnal", "Struktur sesuai standar", "Referensi dasar"]}, {"id": "jurnal-lengkap", "name": "Paket Lengkap (Penulisan & Bantuan Publikasi)", "price": 1200000, "features": ["Semua fitur penulisan", "Analisis & editing mendalam", "Bantuan submisi ke jurnal target"]}] 
  },
  {
    id: 'joki-3d',
    title: 'Joki 3D Modeling',
    description: 'Pembuatan model 3D profesional untuk berbagai keperluan',
    price: 1800000,
    icon: 'Cube',
    category: 'Design',
    popular: false,
    features: ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"],
    delivery_time: '5-10 hari',
    revisions: '3x revisi gratis',
    sub_options: [{"id": "3d-standar", "name": "Paket Standar", "price": 1800000, "features": ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"]}] 
  },
  {
    id: 'konsultasi',
    title: 'Konsultasi Akademik',
    description: 'Bimbingan dan konsultasi untuk berbagai kebutuhan akademik',
    price: 150000,
    icon: 'Users',
    category: 'Consultation',
    popular: false,
    features: ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"],
    delivery_time: '1-2 hari',
    revisions: 'Unlimited chat',
    sub_options: [{"id": "konsultasi-standar", "name": "Sesi Konsultasi", "price": 150000, "features": ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"]}] 
  },
];

async function migrate() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Role Key is missing from .env.local');
    console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Deleting all existing services from the table to prevent duplicates...');
  const { error: deleteError } = await supabase.from('services').delete().neq('id', 'a-dummy-id-that-will-never-exist');
  if (deleteError) {
    console.error('Error deleting existing services:', deleteError.message);
    process.exit(1);
  }
  console.log('Existing services deleted successfully.');

  console.log('Inserting new services...');
  const { error: insertError } = await supabase.from('services').insert(servicesData);

  if (insertError) {
    console.error('Error inserting services:', insertError.message);
    process.exit(1);
  }

  console.log('✅ Migration successful! All services have been inserted into the database.');
}

migrate();
