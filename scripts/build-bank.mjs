// Perakit bank soal: menggabungkan soal tulisan tangan (authored.mjs) dan soal
// numerik hasil generator, menempatkan kunci jawaban secara seimbang ke posisi
// A–D (pola acak deterministik), lalu menulis JSON ke src/data/paket/.
// Jalankan: node scripts/build-bank.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { generateNumerik, mulberry32 } from './generate-numerik.mjs';
import { bintaraPU, bintaraWK, bintaraEN, akpolPU, akpolWK, akpolBI } from './authored.mjs';

function tempatkanKunci(soalMentah, seed) {
  const rng = mulberry32(seed);
  // pola target posisi kunci: ulangi [0,1,2,3] lalu acak per blok 4
  const target = [];
  while (target.length < soalMentah.length) {
    const blok = [0, 1, 2, 3];
    for (let i = blok.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [blok[i], blok[j]] = [blok[j], blok[i]];
    }
    target.push(...blok);
  }
  return soalMentah.map((s, i) => {
    const posisi = target[i];
    const pengecoh = [...s.pengecoh];
    // acak urutan pengecoh secara deterministik
    for (let a = pengecoh.length - 1; a > 0; a--) {
      const j = Math.floor(rng() * (a + 1));
      [pengecoh[a], pengecoh[j]] = [pengecoh[j], pengecoh[a]];
    }
    const pilihan = [];
    let pi = 0;
    for (let k = 0; k < 4; k++) pilihan.push(k === posisi ? s.benar : pengecoh[pi++]);
    return { tanya: s.tanya, pilihan, kunci: posisi, bahasan: s.bahasan, topik: s.topik };
  });
}

function rakit(meta, bagian, seedKunci) {
  const mentah = bagian.flat();
  const soal = tempatkanKunci(mentah, seedKunci);
  return { ...meta, soal };
}

const bintara = rakit(
  {
    slug: 'bintara-akademik',
    jalur: 'bintara',
    judul: 'Prediksi Soal Tes Akademik Bintara Polri',
    durasiMenit: 75,
    intro:
      'Prediksi soal tes akademik Bintara Polri berdasarkan daftar mata uji dalam pengumuman resmi penerimaan Polri: 50 soal latihan orisinal — Pengetahuan Umum 12 soal (termasuk dasar-dasar UU No. 2 Tahun 2002 tentang Kepolisian), Wawasan Kebangsaan 13 soal, Penalaran Numerik 13 soal, dan Bahasa Inggris 12 soal. Setiap soal dilengkapi kunci jawaban dan pembahasan; soal numerik dihasilkan generator dengan kunci yang terhitung program. Paket ini adalah latihan mandiri, bukan bocoran dan bukan soal resmi seleksi.',
  },
  [bintaraPU, bintaraWK, generateNumerik(20261109, 13), bintaraEN],
  4101,
);

const akpol = rakit(
  {
    slug: 'akpol-daerah',
    jalur: 'akpol',
    judul: 'Prediksi Soal Tes Akademik Akpol (Tingkat Daerah)',
    durasiMenit: 60,
    intro:
      'Prediksi soal tes akademik Taruna Akpol tingkat daerah (Panda) berdasarkan daftar mata uji dalam pengumuman resmi penerimaan Polri: 40 soal latihan orisinal — Pengetahuan Umum 10 soal, Wawasan Kebangsaan 10 soal, Bahasa Indonesia 10 soal, dan Penalaran Numerik 10 soal. Di tingkat pusat, seleksi Akpol menambah Tes Potensi Akademik (TPA) dan Bahasa Inggris. Setiap soal dilengkapi kunci jawaban dan pembahasan; soal numerik dihasilkan generator dengan kunci yang terhitung program. Paket ini adalah latihan mandiri, bukan bocoran dan bukan soal resmi seleksi.',
  },
  [akpolPU, akpolWK, akpolBI, generateNumerik(987654, 10, 5)],
  7202,
);

mkdirSync(new URL('../src/data/paket/', import.meta.url), { recursive: true });
for (const p of [bintara, akpol]) {
  const path = new URL(`../src/data/paket/${p.slug}.json`, import.meta.url);
  writeFileSync(path, JSON.stringify(p, null, 2) + '\n');
  const perTopik = {};
  for (const s of p.soal) perTopik[s.topik] = (perTopik[s.topik] || 0) + 1;
  const kunci = [0, 0, 0, 0];
  for (const s of p.soal) kunci[s.kunci]++;
  console.log(`${p.slug}: ${p.soal.length} soal | topik ${JSON.stringify(perTopik)} | kunci A/B/C/D = ${kunci.join('/')}`);
}
console.log('Bank soal ditulis ke src/data/paket/');
