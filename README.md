# PrediksiPolri — Demo Lokal

Situs demo latihan soal tes akademik Polri (Astro 5, statis). Brand sementara "PrediksiPolri".
**Status: demo lokal saja — belum dipush, belum dipublikasikan.**

## Isi
- 2 paket contoh: Bintara (50 soal) dan Akpol tingkat daerah (40 soal) — total 90 soal latihan orisinal.
- Halaman: beranda, /paket/, /paket/<slug>/, /kisi-kisi/, /tentang/, /kontak/, /privasi/, /disclaimer/, 404, sitemap.xml, robots.txt.

## Bank soal
- Soal tulisan tangan: `scripts/authored.mjs` (fakta publik: UUD 1945, UU No. 2/2002, PUEBI/KBBI, grammar SMA).
- Soal Penalaran Numerik: dihasilkan `scripts/generate-numerik.mjs` — kunci terhitung program.
- Rakit ulang bank: `node scripts/build-bank.mjs` (menulis `src/data/paket/*.json`, kunci diseimbangkan A–D).
- Validasi bank: `node scripts/validate-bank.mjs` (skema, jumlah per topik, duplikat lintas paket, distribusi kunci).

## Jalan lokal
```
npm install
npm run build
python3 -m http.server 8411 --directory dist
```
Audit: `node ~/workspace/audit-tools/audit-gate-pp.mjs dist 8411` dan uji fungsi `node ~/workspace/audit-tools/pp-func-check.mjs 8411`.

Catatan: canonical memakai domain rencana https://prediksipolri.click (placeholder untuk demo);
email kontak demo: prediksipolri@gmail.com.
