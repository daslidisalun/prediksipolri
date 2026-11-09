// Registry bank soal: satu berkas JSON per paket di src/data/paket/.
// Menambah paket baru = menambah berkas JSON + satu baris impor di sini.
// Semua soal adalah soal LATIHAN ORISINAL (lihat scripts/ untuk generator & validasi).

import bintara from '../data/paket/bintara-akademik.json';
import akpol from '../data/paket/akpol-daerah.json';

export interface Soal {
  tanya: string;
  pilihan: string[];
  kunci: number; // indeks 0-3
  bahasan: string;
  topik: string;
}

export interface Paket {
  slug: string;
  jalur: string; // slug jalur di src/config/site.ts
  judul: string;
  durasiMenit: number;
  intro: string;
  soal: Soal[];
}

export const PAKETS: Paket[] = [bintara, akpol] as Paket[];

export function cariPaket(slug: string): Paket | undefined {
  return PAKETS.find((p) => p.slug === slug);
}

export function paketByJalur(jalur: string): Paket[] {
  return PAKETS.filter((p) => p.jalur === jalur);
}

export function totalSoal(): number {
  return PAKETS.reduce((s, p) => s + p.soal.length, 0);
}

export function hitungTopik(p: Paket): { topik: string; jumlah: number }[] {
  const m = new Map<string, number>();
  for (const s of p.soal) m.set(s.topik, (m.get(s.topik) || 0) + 1);
  return [...m.entries()].map(([topik, jumlah]) => ({ topik, jumlah }));
}

export const HURUF = ['A', 'B', 'C', 'D'];
