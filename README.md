# Done Fast

Selamat datang di repositori proyek Done Fast! Ini adalah aplikasi web yang dibangun untuk menyediakan berbagai layanan digital, berfokus pada bantuan pengerjaan tugas atau proyek.

## ✨ Fitur Utama

Berdasarkan struktur proyek, berikut adalah beberapa fitur yang ada:

*   **Halaman Utama**: Landing page yang menarik dengan beberapa bagian seperti Hero, Cara Pesan, Layanan, Paket, Testimoni, dan Kontak.
*   **Penjelajahan Layanan**: Pengguna dapat melihat berbagai layanan yang ditawarkan.
*   **Sistem Keranjang (Cart)**: Pengguna dapat menambahkan layanan ke keranjang belanja.
*   **Admin Dashboard**: Panel admin untuk mengelola pesanan, melihat feedback, dll.
*   **Sistem Feedback**: Pengguna dapat memberikan umpan balik.
*   **Desain Responsif**: Dibuat dengan komponen yang mendukung tampilan mobile.

## 🚀 Teknologi yang Digunakan

*   **Framework**: [Next.js](https://nextjs.org/) (React Framework)
*   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan [shadcn/ui](https://ui.shadcn.com/) untuk komponen UI.
*   **Backend & Database**: [Supabase](https://supabase.io/)
*   **Manajemen Form**: [React Hook Form](https://react-hook-form.com/)
*   **Validasi Skema**: [Zod](https://zod.dev/)

## ⚙️ Cara Menjalankan Proyek Secara Lokal

Berikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda.

### Prasyarat

Pastikan Anda sudah menginstal:

*   [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
*   [pnpm](https://pnpm.io/installation) (atau package manager lain seperti npm/yarn)

### Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone <URL_REPOSITORI>
    cd Done_Fast/don-efast-website
    ```

2.  **Install dependencies:**
    Gunakan `pnpm` untuk menginstal semua paket yang dibutuhkan.
    ```bash
    pnpm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env.local` di dalam direktori `don-efast-website` dan tambahkan kredensial Supabase Anda. Anda bisa menyalin dari `.env.example` jika ada.
    ```
    NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
    ```

### Menjalankan Aplikasi

Setelah instalasi selesai, jalankan server pengembangan:

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📁 Struktur Proyek

```
/don-efast-website
├── app/                # Direktori utama untuk halaman dan layout (App Router)
│   ├── admin/          # Halaman-halaman khusus admin
│   ├── services/       # Halaman untuk layanan
│   └── page.tsx        # Halaman utama (Homepage)
├── components/         # Komponen React yang dapat digunakan kembali
│   └── ui/             # Komponen UI dari shadcn/ui
├── lib/                # Fungsi-fungsi bantuan dan utilitas
│   └── supabase/       # Konfigurasi client & server Supabase
├── public/             # Aset statis (gambar, font, dll.)
├── scripts/            # Skrip SQL untuk migrasi database
└── ...
```
