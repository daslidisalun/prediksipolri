// PrediksiPolri — identitas situs dan registry jalur penerimaan.
// Bank soal (paket) dimuat dari src/lib/paket.ts; berkas ini memuat metadata tampilannya.

export const SITE_NAME = 'PrediksiPolri';
export const SITE_URL = 'https://daslidisalun.github.io';
export const BASE_PATH = '/prediksipolri';
export const SITE_TAGLINE = 'Latihan soal tes akademik Polri, disusun dari daftar mata uji resmi';
export const SITE_DESCRIPTION =
  'PrediksiPolri menyediakan latihan soal tes akademik Polri untuk jalur Akpol, Bintara, dan Tamtama — soal latihan orisinal yang disusun dari daftar mata uji dalam pengumuman resmi penerimaan Polri, lengkap dengan kunci jawaban dan pembahasan. Klik jawaban dan hasilnya ketahuan seketika, atau cetak paketnya untuk dikerjakan di kertas. Bukan bocoran, bukan soal resmi, dan tidak berafiliasi dengan Polri.';

export function withBase(path: string): string {
  if (path === '/') return BASE_PATH + '/';
  return BASE_PATH + (path.startsWith('/') ? path : '/' + path);
}

export function absolute(path: string): string {
  return SITE_URL + withBase(path);
}

export interface Jalur {
  slug: string;
  nama: string;
  ikon: string; // monogram jalur
  deskripsi: string;
  mataUjiDaerah: string[];
  catatan: string;
}

export const JALURS: Jalur[] = [
  {
    slug: 'akpol',
    nama: 'Taruna Akpol',
    ikon: 'AKP',
    deskripsi:
      'Jalur perwira: pendidikan 4 tahun di Akademi Kepolisian, Semarang, lulus berpangkat Inspektur Polisi Dua (Ipda). Seleksi akademiknya paling berlapis — tingkat daerah dan tingkat pusat memakai daftar mata uji yang berbeda.',
    mataUjiDaerah: ['Pengetahuan Umum (termasuk UU Kepolisian)', 'Wawasan Kebangsaan', 'Penalaran Numerik', 'Bahasa Indonesia'],
    catatan: 'Di tingkat pusat ditambah Tes Potensi Akademik (TPA) dan Bahasa Inggris.',
  },
  {
    slug: 'bintara',
    nama: 'Bintara Polri',
    ikon: 'BIN',
    deskripsi:
      'Jalur dengan kuota terbesar: Bintara Polisi Tugas Umum (PTU), Brimob, Polair, dan Bintara Kompetensi Khusus (Bakomsus). Lulus pendidikan pembentukan berpangkat Brigadir Polisi Dua (Bripda).',
    mataUjiDaerah: ['Pengetahuan Umum (termasuk UU Kepolisian)', 'Wawasan Kebangsaan', 'Penalaran Numerik', 'Bahasa Inggris'],
    catatan: 'Bakomsus menambah Tes Kompetensi Keahlian (TKK) sesuai bidangnya; Bintara juga dapat diuji kemampuan komputer dasar.',
  },
  {
    slug: 'tamtama',
    nama: 'Tamtama Polri',
    ikon: 'TAM',
    deskripsi:
      'Jalur pelaksana untuk kesatuan Brimob dan Polair, pendidikan pembentukan sekitar 5 bulan, lulus berpangkat Bhayangkara Dua (Bharada).',
    mataUjiDaerah: ['Pengetahuan Umum (termasuk UU Kepolisian)', 'Wawasan Kebangsaan', 'Penalaran Numerik', 'Bahasa Indonesia'],
    catatan: 'Daftar mata uji mengikuti pengumuman penerimaan Tamtama tahun anggaran berjalan.',
  },
];

export function jalurBySlug(slug: string): Jalur | undefined {
  return JALURS.find((j) => j.slug === slug);
}
