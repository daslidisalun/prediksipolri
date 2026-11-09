// Validasi bank soal PrediksiPolri — dijalankan dengan node.
// Pemeriksaan: skema, jumlah per paket & per topik sesuai spesifikasi,
// tidak ada tanya duplikat (di dalam maupun antar paket), kunci valid,
// bahasan tidak kosong, distribusi kunci tidak timpang (tidak ada huruf > 45%).
// Jalankan: node scripts/validate-bank.mjs

import { readFileSync } from 'node:fs';

const SPESIFIKASI = [
  {
    berkas: 'bintara-akademik.json',
    total: 50,
    topik: { 'Pengetahuan Umum': 12, 'Wawasan Kebangsaan': 13, 'Penalaran Numerik': 13, 'Bahasa Inggris': 12 },
  },
  {
    berkas: 'akpol-daerah.json',
    total: 40,
    topik: { 'Pengetahuan Umum': 10, 'Wawasan Kebangsaan': 10, 'Bahasa Indonesia': 10, 'Penalaran Numerik': 10 },
  },
];

let gagal = 0;
const salah = (m) => { gagal++; console.log('  GAGAL', m); };
const normal = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();
const semuaTanya = new Map();

for (const spec of SPESIFIKASI) {
  const path = new URL(`../src/data/paket/${spec.berkas}`, import.meta.url).pathname;
  let p;
  try {
    p = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    salah(`${spec.berkas}: JSON tidak valid / berkas hilang (${e.message})`);
    continue;
  }
  console.log(`CHECK ${spec.berkas}: ${p.soal?.length} soal`);
  if (!p.slug || !p.judul || !p.intro || !p.durasiMenit || !p.jalur) salah(`${spec.berkas}: metadata tidak lengkap`);
  if (p.soal.length !== spec.total) salah(`${spec.berkas}: total soal ${p.soal.length}, seharusnya ${spec.total}`);

  const perTopik = {};
  const kunciHitung = [0, 0, 0, 0];
  const tanyaPaket = new Set();
  p.soal.forEach((s, i) => {
    const id = `${spec.berkas} soal ${i + 1}`;
    if (!s.tanya || typeof s.tanya !== 'string' || s.tanya.length < 10) salah(`${id}: tanya kosong/terlalu pendek`);
    const nt = normal(s.tanya || '');
    if (tanyaPaket.has(nt)) salah(`${id}: tanya duplikat di dalam paket`);
    tanyaPaket.add(nt);
    if (semuaTanya.has(nt)) salah(`${id}: tanya duplikat dengan ${semuaTanya.get(nt)}`);
    semuaTanya.set(nt, id);
    if (!Array.isArray(s.pilihan) || s.pilihan.length !== 4) salah(`${id}: pilihan bukan 4`);
    else {
      if (new Set(s.pilihan.map((x) => String(x).trim())).size !== 4) salah(`${id}: ada pilihan duplikat`);
      if (s.pilihan.some((x) => !String(x).trim())) salah(`${id}: ada pilihan kosong`);
    }
    if (!Number.isInteger(s.kunci) || s.kunci < 0 || s.kunci > 3) salah(`${id}: kunci = ${s.kunci}`);
    else kunciHitung[s.kunci]++;
    if (!s.bahasan || s.bahasan.length < 30) salah(`${id}: bahasan kosong/terlalu pendek (${s.bahasan ? s.bahasan.length : 0} karakter)`);
    if (!s.topik) salah(`${id}: topik kosong`);
    perTopik[s.topik] = (perTopik[s.topik] || 0) + 1;
  });

  for (const [topik, jumlah] of Object.entries(spec.topik)) {
    if (perTopik[topik] !== jumlah) salah(`${spec.berkas}: topik "${topik}" = ${perTopik[topik] || 0}, seharusnya ${jumlah}`);
  }
  const ekstra = Object.keys(perTopik).filter((t) => !(t in spec.topik));
  if (ekstra.length) salah(`${spec.berkas}: topik tak terduga: ${ekstra.join(', ')}`);

  const maks = Math.max(...kunciHitung);
  console.log(`  kunci A/B/C/D = ${kunciHitung.join('/')} (terbesar ${(100 * maks / p.soal.length).toFixed(0)}%)`);
  if (maks / p.soal.length > 0.45) salah(`${spec.berkas}: distribusi kunci timpang, huruf terbanyak ${(100 * maks / p.soal.length).toFixed(0)}% > 45%`);
  if (Math.min(...kunciHitung) === 0) salah(`${spec.berkas}: ada posisi kunci yang tidak pernah dipakai`);
}

console.log(`\nTotal soal unik lintas paket: ${semuaTanya.size}`);
console.log(gagal === 0 ? 'SEMUA PEMERIKSAAN LULUS' : `${gagal} PEMERIKSAAN GAGAL`);
process.exit(gagal === 0 ? 0 : 1);
