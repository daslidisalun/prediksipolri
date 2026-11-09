// PrediksiPolri — mesin kuis sisi browser.
// Satu mode instan: klik jawaban -> langsung ketahuan benar/salah beserta
// pembahasannya, skor berjalan tampil di toolbar. Bagian uraian memakai kotak
// teks dengan contoh jawaban periksa-sendiri. Semua state hanya hidup di
// halaman ini; tidak ada yang dikirim ke server.

const HURUF = ['A', 'B', 'C', 'D'];

export function initKuis() {
  const wadah = document.getElementById('kuis-app');
  const dataEl = document.getElementById('paket-data');
  if (!wadah || !dataEl) return;
  const paket = JSON.parse(dataEl.textContent);
  const soal = paket.soal;

  let jawaban = new Array(soal.length).fill(null);
  let terkunci = new Array(soal.length).fill(false);

  wadah.innerHTML = `
    <div class="kuis-toolbar">
      <div class="kuis-status">
        <span class="chip">Skor: <strong id="kuis-skor">0</strong></span>
        <span class="chip">Terjawab: <strong id="kuis-terjawab">0/${soal.length}</strong></span>
        <span class="chip" id="kuis-selesai-chip" hidden>Paket selesai — ulangi untuk skor lebih baik</span>
      </div>
      <button class="btn ghost" id="kuis-ulang">Ulangi Paket</button>
    </div>
    <div id="kuis-daftar"></div>
    <div id="kuis-essay"></div>
  `;

  const daftar = wadah.querySelector('#kuis-daftar');
  const elSkor = wadah.querySelector('#kuis-skor');
  const elTerjawab = wadah.querySelector('#kuis-terjawab');
  const elSelesaiChip = wadah.querySelector('#kuis-selesai-chip');

  function gambarUlang() {
    daftar.innerHTML = soal.map((s, i) => {
      const terpilih = jawaban[i];
      const periksa = terkunci[i];
      const opsi = s.pilihan.map((p, j) => {
        let kelas = 'opsi';
        if (terpilih === j) kelas += ' dipilih';
        if (periksa) {
          if (j === s.kunci) kelas += ' benar';
          else if (terpilih === j) kelas += ' salah';
        }
        return `<button class="${kelas}" data-soal="${i}" data-opsi="${j}" ${periksa ? 'disabled' : ''}>
          <span class="opsi-huruf">${HURUF[j]}</span><span>${p}</span></button>`;
      }).join('');
      const bahasan = periksa
        ? `<div class="bahasan"><strong>${terpilih === s.kunci ? 'Benar! ' : `Belum tepat — jawaban benar: ${HURUF[s.kunci]}. `}</strong>${s.bahasan}</div>`
        : '';
      return `<div class="kartu-soal" id="soal-${i + 1}">
        <div class="soal-kepala"><span class="soal-nomor">${i + 1}</span><span class="soal-topik">${s.topik}</span></div>
        <p class="soal-tanya">${s.tanya}</p>
        <div class="opsi-daftar">${opsi}</div>
        ${bahasan}
      </div>`;
    }).join('');

    const terjawab = jawaban.filter((j) => j !== null).length;
    const benar = soal.reduce((n, s, i) => n + (jawaban[i] === s.kunci ? 1 : 0), 0);
    elTerjawab.textContent = `${terjawab}/${soal.length}`;
    elSkor.textContent = terjawab ? String(Math.round((benar / soal.length) * 100)) : '0';
    elSelesaiChip.hidden = terjawab !== soal.length;
  }

  const essay = paket.essay || [];
  if (essay.length) {
    const wadahEssay = wadah.querySelector('#kuis-essay');
    wadahEssay.innerHTML = `
      <h3 class="essay-judul">Bagian II — Soal Uraian (${essay.length} soal)</h3>
      <p class="essay-petunjuk">Tulis jawabanmu di kotak yang tersedia. Soal uraian tidak dinilai otomatis —
      setelah selesai, bandingkan jawabanmu dengan contoh jawaban untuk memeriksa sendiri.</p>
      ${essay.map((e, i) => `
        <div class="kartu-soal">
          <div class="soal-kepala"><span class="soal-nomor">${soal.length + i + 1}</span><span class="soal-topik">Uraian</span></div>
          <p class="soal-tanya">${e.tanya}</p>
          <textarea class="essay-jawaban" rows="3" placeholder="Tulis jawabanmu di sini..."></textarea>
          <button class="btn ghost btn-essay" data-essay="${i}">Lihat Contoh Jawaban</button>
          <div class="bahasan" id="essay-kunci-${i}" hidden><strong>Contoh jawaban:</strong> ${e.jawaban}</div>
        </div>`).join('')}`;
    wadahEssay.addEventListener('click', (ev) => {
      const b = ev.target.closest('.btn-essay');
      if (!b) return;
      const el = wadahEssay.querySelector('#essay-kunci-' + b.dataset.essay);
      if (el) { el.hidden = !el.hidden; b.textContent = el.hidden ? 'Lihat Contoh Jawaban' : 'Sembunyikan Contoh Jawaban'; }
    });
  }

  wadah.addEventListener('click', (ev) => {
    if (ev.target.closest('#kuis-ulang')) {
      jawaban = new Array(soal.length).fill(null);
      terkunci = new Array(soal.length).fill(false);
      wadah.querySelectorAll('.essay-jawaban').forEach((t) => { t.value = ''; });
      gambarUlang();
      return;
    }
    const btnOpsi = ev.target.closest('.opsi');
    if (!btnOpsi) return;
    const i = Number(btnOpsi.dataset.soal);
    const j = Number(btnOpsi.dataset.opsi);
    if (terkunci[i]) return;
    jawaban[i] = j;
    terkunci[i] = true;
    gambarUlang();
  });

  gambarUlang();
}
