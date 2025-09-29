"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv_1 = require("dotenv");
var path = require("path");
// Configure dotenv to load variables from .env.local
(0, dotenv_1.config)({ path: path.resolve(__dirname, '../.env.local') });
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var servicesData = [
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
        sub_options: [{ "id": "penulisan-standar", "name": "Paket Standar", "price": 250000, "features": ["Essay & Artikel", "Makalah & Paper", "Review Jurnal", "Proposal Penelitian", "Laporan Praktikum"] }],
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
        sub_options: [{ "id": "skripsi-bab1-3", "name": "Bab 1 - 3 Saja", "price": 900000, "features": ["Bab 1", "Bab 2", "Bab 3"] }, { "id": "skripsi-bab4-5", "name": "Bab 4 - 5 + Free PPT", "price": 1800000, "features": ["Bab 4", "Bab 5", "Free Pembuatan PPT"] }, { "id": "skripsi-full", "name": "Full Bab", "price": 2900000, "features": ["Bab 1-5 Lengkap", "Bimbingan Penuh", "Gratis Presentasi PPT"] }],
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
        sub_options: [{ "id": "program-standar", "name": "Paket Standar", "price": 1500000, "features": ["Website & Web App", "Mobile App", "Desktop Application", "Database Design", "API Development"] }],
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
        sub_options: [{ "id": "jurnal-penulisan", "name": "Joki Penulisan Saja", "price": 200000, "features": ["Penulisan draf jurnal", "Struktur sesuai standar", "Referensi dasar"] }, { "id": "jurnal-lengkap", "name": "Paket Lengkap (Penulisan & Bantuan Publikasi)", "price": 1200000, "features": ["Semua fitur penulisan", "Analisis & editing mendalam", "Bantuan submisi ke jurnal target"] }]
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
        sub_options: [{ "id": "3d-standar", "name": "Paket Standar", "price": 1800000, "features": ["Architectural 3D", "Product Modeling", "Character Design", "Animation", "Rendering"] }]
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
        sub_options: [{ "id": "konsultasi-standar", "name": "Sesi Konsultasi", "price": 150000, "features": ["Konsultasi 1-on-1", "Review Dokumen", "Guidance & Tips", "Q&A Session", "Follow-up Support"] }]
    },
];
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var supabase, deleteError, insertError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!supabaseUrl || !supabaseServiceKey) {
                        console.error('Supabase URL or Service Role Key is missing from .env.local');
                        console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
                        process.exit(1);
                    }
                    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
                    console.log('Deleting all existing services from the table to prevent duplicates...');
                    return [4 /*yield*/, supabase.from('services').delete().neq('id', 'a-dummy-id-that-will-never-exist')];
                case 1:
                    deleteError = (_a.sent()).error;
                    if (deleteError) {
                        console.error('Error deleting existing services:', deleteError.message);
                        process.exit(1);
                    }
                    console.log('Existing services deleted successfully.');
                    console.log('Inserting new services...');
                    return [4 /*yield*/, supabase.from('services').insert(servicesData)];
                case 2:
                    insertError = (_a.sent()).error;
                    if (insertError) {
                        console.error('Error inserting services:', insertError.message);
                        process.exit(1);
                    }
                    console.log('✅ Migration successful! All services have been inserted into the database.');
                    return [2 /*return*/];
            }
        });
    });
}
migrate();
