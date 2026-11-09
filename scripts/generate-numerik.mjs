// Generator soal Penalaran Numerik — kunci jawaban DIHITUNG oleh program,
// bukan ditulis tangan, sehingga tidak mungkin salah kunci.
// Setiap templat mengembalikan { tanya, benar, pengecoh[3], bahasan, topik }.
// Penempatan kunci ke posisi A–D dilakukan perakit (build-bank.mjs).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmt = (n) => n.toLocaleString('id-ID');
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const ri = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));

function unik(benar, kandidat) {
  const out = [];
  for (const k of kandidat) {
    if (k !== benar && !out.includes(k)) out.push(k);
    if (out.length === 3) break;
  }
  let t = 1;
  while (out.length < 3) { if (!out.includes(benar + t) && benar + t !== benar) out.push(benar + t); t++; }
  return out;
}

function persenDari(rng) {
  const persen = pick(rng, [5, 10, 12, 15, 20, 25, 30, 40, 60, 75]);
  const n = pick(rng, [120, 160, 200, 240, 300, 360, 400, 480, 600, 800]);
  const benar = (persen / 100) * n;
  return {
    tanya: `Berapakah ${persen}% dari ${fmt(n)}?`,
    benar: fmt(benar),
    pengecoh: unik(benar, [benar + n / 10, benar * 2, Math.max(1, benar - n / 20), persen * n / 10]).map(fmt),
    bahasan: `${persen}% dari ${fmt(n)} = ${persen}/100 × ${fmt(n)} = ${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function diskon(rng) {
  const harga = ri(rng, 12, 60) * 10000;
  const d = pick(rng, [10, 15, 20, 25, 30, 40]);
  const potongan = (harga * d) / 100;
  const benar = harga - potongan;
  return {
    tanya: `Sebuah tas berharga Rp${fmt(harga)}. Toko memberikan diskon ${d}%. Berapa rupiah yang harus dibayar pembeli?`,
    benar: `Rp${fmt(benar)}`,
    pengecoh: unik(benar, [potongan, harga - (harga * (d + 10)) / 100, harga - (harga * (d - 5)) / 100, harga]).map((v) => `Rp${fmt(v)}`),
    bahasan: `Potongan harga = ${d}% × Rp${fmt(harga)} = Rp${fmt(potongan)}. Yang dibayar = Rp${fmt(harga)} − Rp${fmt(potongan)} = Rp${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function perbandingan(rng) {
  let a = ri(rng, 2, 6), b = ri(rng, 3, 8);
  if (a === b) b += 1;
  const k = ri(rng, 6, 16);
  // sederhanakan rasio tampilan (mis. 4:6 -> 2:3) tanpa mengubah hasil
  const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
  const g = gcd(a, b);
  const total = (a + b) * k;
  const benar = b * k;
  const aT = a / g, bT = b / g, kT = k * g;
  return {
    tanya: `Perbandingan jumlah calon siswa laki-laki dan perempuan dalam satu kelas latihan adalah ${aT} : ${bT}. Jika jumlah seluruh calon siswa ${total} orang, berapa jumlah calon siswa perempuan?`,
    benar: fmt(benar),
    pengecoh: unik(benar, [aT * kT, benar + kT, benar - kT > 0 ? benar - kT : benar + 2 * kT, total - aT * kT]).map(fmt),
    bahasan: `Jumlah perbandingan = ${aT} + ${bT} = ${aT + bT}. Nilai satu bagian = ${total} ÷ ${aT + bT} = ${kT}. Calon siswa perempuan = ${bT} × ${kT} = ${fmt(benar)} orang.`,
    topik: 'Penalaran Numerik',
  };
}

function deretArit(rng) {
  const a = ri(rng, 3, 30);
  const d = pick(rng, [2, 3, 4, 5, 6, 7, 9, 11]);
  const terms = [0, 1, 2, 3, 4].map((i) => a + i * d);
  const benar = a + 5 * d;
  return {
    tanya: `Suku berikutnya dari deret ${terms.join(', ')}, … adalah …`,
    benar: fmt(benar),
    pengecoh: unik(benar, [benar + d, benar - d, benar + 2 * d, a + 6 * d]).map(fmt),
    bahasan: `Deret ini berpola tambah ${d} setiap suku: ${terms.join(', ')}, lalu ${fmt(a + 4 * d)} + ${d} = ${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function deretGeo(rng) {
  const a = ri(rng, 2, 6);
  const r = pick(rng, [2, 3]);
  const terms = [0, 1, 2, 3].map((i) => a * r ** i);
  const benar = a * r ** 4;
  return {
    tanya: `Suku berikutnya dari deret ${terms.join(', ')}, … adalah …`,
    benar: fmt(benar),
    pengecoh: unik(benar, [benar + a * r ** 3, benar * 2, a * r ** 5, benar - a]).map(fmt),
    bahasan: `Deret ini berpola kali ${r} setiap suku: ${terms.join(', ')}, lalu ${fmt(a * r ** 3)} × ${r} = ${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function deretHuruf(rng) {
  const start = ri(rng, 0, 12);
  const step = pick(rng, [2, 3, 4]);
  const huruf = (i) => String.fromCharCode(65 + i);
  const terms = [0, 1, 2, 3, 4].map((i) => huruf(start + i * step));
  const benarIdx = start + 5 * step;
  const benar = huruf(benarIdx);
  const pengecohIdx = unik(benarIdx, [benarIdx + 1, benarIdx - 1, benarIdx + step, benarIdx + 2]);
  return {
    tanya: `Huruf berikutnya dari deret ${terms.join(', ')}, … adalah …`,
    benar,
    pengecoh: pengecohIdx.map(huruf),
    bahasan: `Setiap huruf maju ${step} langkah dalam alfabet: ${terms.join(' → ')} → ${benar}.`,
    topik: 'Penalaran Numerik',
  };
}

function kecepatan(rng) {
  const mode = rng() < 0.5 ? 'v' : 't';
  if (mode === 'v') {
    const jarak = pick(rng, [90, 120, 150, 180, 240, 300]);
    const waktu = pick(rng, [2, 3, 4, 5, 6]);
    const benar = jarak / waktu;
    return {
      tanya: `Sebuah mobil patroli menempuh jarak ${jarak} km dalam waktu ${waktu} jam dengan kecepatan tetap. Kecepatan rata-rata mobil tersebut adalah …`,
      benar: `${fmt(benar)} km/jam`,
      pengecoh: unik(benar, [benar + 10, benar + 15, benar * 2, benar > 15 ? benar - 10 : benar + 20]).map((v) => `${fmt(v)} km/jam`),
      bahasan: `Kecepatan = jarak ÷ waktu = ${jarak} ÷ ${waktu} = ${fmt(benar)} km/jam.`,
      topik: 'Penalaran Numerik',
    };
  }
  const kec = pick(rng, [40, 50, 60, 80]);
  const waktu = ri(rng, 2, 6);
  const jarak = kec * waktu;
  return {
    tanya: `Sebuah kendaraan melaju dengan kecepatan tetap ${kec} km/jam. Waktu yang dibutuhkan untuk menempuh jarak ${jarak} km adalah …`,
    benar: `${waktu} jam`,
    pengecoh: unik(waktu, [waktu + 1, waktu - 1 > 0 ? waktu - 1 : waktu + 2, waktu + 2, waktu * 2]).map((v) => `${v} jam`),
    bahasan: `Waktu = jarak ÷ kecepatan = ${jarak} ÷ ${kec} = ${waktu} jam.`,
    topik: 'Penalaran Numerik',
  };
}

function spldv(rng) {
  const x = ri(rng, 3, 9) * 1000; // harga buku
  const y = ri(rng, 2, 6) * 1000; // harga pensil
  const t1 = 3 * x + 2 * y;
  const t2 = 1 * x + 4 * y;
  const benar = 2 * x + 3 * y;
  return {
    tanya: `Harga 3 buku dan 2 pensil adalah Rp${fmt(t1)}, sedangkan harga 1 buku dan 4 pensil adalah Rp${fmt(t2)}. Harga 2 buku dan 3 pensil adalah …`,
    benar: `Rp${fmt(benar)}`,
    pengecoh: unik(benar, [3 * x + 3 * y, 2 * x + 2 * y, t1, 4 * x + 1 * y]).map((v) => `Rp${fmt(v)}`),
    bahasan: `Misalkan harga buku x dan pensil y. Dari kedua persamaan diperoleh x = Rp${fmt(x)} dan y = Rp${fmt(y)} (eliminasi: kalikan persamaan kedua dengan 3 lalu kurangkan). Maka 2x + 3y = Rp${fmt(2 * x)} + Rp${fmt(3 * y)} = Rp${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function bunga(rng) {
  const modal = ri(rng, 2, 9) * 1000000;
  const rate = pick(rng, [4, 5, 6, 8, 10]);
  const tahun = ri(rng, 1, 3);
  const benar = (modal * rate * tahun) / 100;
  return {
    tanya: `Tabungan sebesar Rp${fmt(modal)} disimpan di bank dengan bunga tunggal ${rate}% per tahun. Besar bunga setelah ${tahun} tahun adalah …`,
    benar: `Rp${fmt(benar)}`,
    pengecoh: unik(benar, [(modal * rate) / 100, benar + (modal * rate) / 100, modal + benar, (modal * (rate + 2) * tahun) / 100]).map((v) => `Rp${fmt(v)}`),
    bahasan: `Bunga tunggal = modal × suku bunga × waktu = Rp${fmt(modal)} × ${rate}% × ${tahun} = Rp${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

function untungPersen(rng) {
  const beli = ri(rng, 20, 90) * 10000;
  const persen = pick(rng, [5, 10, 15, 20, 25, 30, 40]);
  const jual = beli + (beli * persen) / 100;
  return {
    tanya: `Seorang pedagang membeli barang seharga Rp${fmt(beli)} dan menjualnya kembali seharga Rp${fmt(jual)}. Persentase keuntungan pedagang tersebut adalah …`,
    benar: `${persen}%`,
    pengecoh: unik(persen, [persen + 5, persen - 5 > 0 ? persen - 5 : persen + 10, persen * 2, persen + 15]).map((v) => `${v}%`),
    bahasan: `Untung = Rp${fmt(jual)} − Rp${fmt(beli)} = Rp${fmt(jual - beli)}. Persentase untung = ${fmt(jual - beli)} ÷ ${fmt(beli)} × 100% = ${persen}%.`,
    topik: 'Penalaran Numerik',
  };
}

function rataRata(rng) {
  const nilai = [ri(rng, 60, 95), ri(rng, 60, 95), ri(rng, 60, 95), ri(rng, 60, 95)];
  const sisa = (5 - ((nilai.reduce((a, b) => a + b, 0) % 5) % 5)) % 5;
  nilai.push(ri(rng, 12, 19) * 5 - sisa > 95 ? 70 : Math.min(95, 65 + sisa));
  const jumlah = nilai.reduce((a, b) => a + b, 0);
  if (jumlah % 5 !== 0) nilai[4] += (5 - (jumlah % 5)) % 5;
  const benar = nilai.reduce((a, b) => a + b, 0) / 5;
  return {
    tanya: `Nilai lima kali latihan seorang calon siswa adalah ${nilai.join(', ')}. Nilai rata-rata calon siswa tersebut adalah …`,
    benar: fmt(benar),
    pengecoh: unik(benar, [benar + 2, benar - 2, benar + 5, Math.round(nilai.reduce((a, b) => a + b, 0) / 4)]).map(fmt),
    bahasan: `Jumlah nilai = ${nilai.join(' + ')} = ${fmt(nilai.reduce((a, b) => a + b, 0))}. Rata-rata = ${fmt(nilai.reduce((a, b) => a + b, 0))} ÷ 5 = ${fmt(benar)}.`,
    topik: 'Penalaran Numerik',
  };
}

const TEMPLAT = [persenDari, diskon, perbandingan, deretArit, deretGeo, deretHuruf, kecepatan, spldv, bunga, untungPersen, rataRata];

export function generateNumerik(seed, jumlah, offset = 0) {
  const rng = mulberry32(seed);
  // acak urutan templat secara deterministik agar pola soal tidak monoton
  const urutan = [...TEMPLAT];
  for (let i = urutan.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [urutan[i], urutan[j]] = [urutan[j], urutan[i]];
  }
  const hasil = [];
  const tanyaDipakai = new Set();
  let idx = offset;
  let penjaga = 0;
  while (hasil.length < jumlah && penjaga < jumlah * 40) {
    penjaga++;
    const buat = urutan[idx % urutan.length];
    idx++;
    const s = buat(rng);
    if (tanyaDipakai.has(s.tanya)) continue;
    if (new Set([s.benar, ...s.pengecoh]).size !== 4) continue;
    tanyaDipakai.add(s.tanya);
    hasil.push(s);
  }
  if (hasil.length < jumlah) throw new Error(`Generator hanya menghasilkan ${hasil.length}/${jumlah} soal unik`);
  return hasil;
}
