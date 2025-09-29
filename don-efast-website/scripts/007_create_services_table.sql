-- Create the services table
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    icon TEXT,
    category TEXT,
    popular BOOLEAN DEFAULT FALSE,
    features JSONB,
    delivery_time TEXT,
    revisions TEXT,
    sub_options JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow admin to insert services" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin to update services" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin to delete services" ON services FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION handle_service_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_service_update
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE PROCEDURE handle_service_update();

-- Insert existing data
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('joki-penulisan', 'Joki Penulisan', 'Layanan penulisan akademik profesional untuk berbagai kebutuhan', 250000, 'FileText', 'Academic', false, '["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"]'::jsonb, '3-7 hari', '3x revisi gratis', '[{"id": "penulisan-standar", "name": "Paket Standar", "price": 250000, "features": ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"]}]'::jsonb);
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('joki-skripsi', 'Joki Skripsi', 'Bantuan penyelesaian skripsi S1 dengan kualitas terbaik', 300000, 'BookOpen', 'Academic', true, '["Skripsi S1", "Proposal & Bab 1-5", "Analisis Data SPSS/R"]'::jsonb, '2-4 minggu', 'Revisi 4 kali', '[{"id": "skripsi-bab1-3", "name": "Bab 1 - 3 Saja", "price": 900000, "features": ["Bab 1", "Bab 2", "Bab 3"]}, {"id": "skripsi-bab4-5", "name": "Bab 4 - 5 + Free PPT", "price": 1800000, "features": ["Bab 4", "Bab 5", "Free Pembuatan PPT"]}, {"id": "skripsi-full", "name": "Full Bab", "price": 2900000, "features": ["Bab 1-5 Lengkap", "Bimbingan Penuh", "Gratis Presentasi PPT"]}]'::jsonb);
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('joki-program', 'Joki Pembuatan Program', 'Pengembangan aplikasi dan sistem sesuai kebutuhan Anda', 1500000, 'Code', 'Programming', false, '["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"]'::jsonb, '1-3 minggu', 'Support & konsultasi', '[{"id": "program-standar", "name": "Paket Standar", "price": 1500000, "features": ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"]}]'::jsonb);
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('joki-jurnal', 'Joki Jurnal Ilmiah', 'Penulisan dan publikasi jurnal ilmiah berkualitas tinggi', 200000, 'Microscope', 'Academic', false, '["Jurnal Nasional / Internasional", "Review & Editing Profesional", "Bantuan & Strategi Publikasi", "Manajemen Sitasi"]'::jsonb, '2-6 minggu', '5x revisi gratis', '[{"id": "jurnal-penulisan", "name": "Joki Penulisan Saja", "price": 200000, "features": ["Penulisan draf jurnal", "Struktur sesuai standar", "Referensi dasar"]}, {"id": "jurnal-lengkap", "name": "Paket Lengkap (Penulisan & Bantuan Publikasi)", "price": 1200000, "features": ["Semua fitur penulisan", "Analisis & editing mendalam", "Bantuan submisi ke jurnal target"]}]'::jsonb);
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('joki-3d', 'Joki 3D Modeling', 'Pembuatan model 3D profesional untuk berbagai keperluan', 1800000, 'Cube', 'Design', false, '["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"]'::jsonb, '5-10 hari', '3x revisi gratis', '[{"id": "3d-standar", "name": "Paket Standar", "price": 1800000, "features": ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"]}]'::jsonb);
INSERT INTO services (id, title, description, price, icon, category, popular, features, delivery_time, revisions, sub_options) VALUES ('konsultasi', 'Konsultasi Akademik', 'Bimbingan dan konsultasi untuk berbagai kebutuhan akademik', 150000, 'Users', 'Consultation', false, '["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"]'::jsonb, '1-2 hari', 'Unlimited chat', '[{"id": "konsultasi-standar", "name": "Sesi Konsultasi", "price": 150000, "features": ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"]}]'::jsonb);
