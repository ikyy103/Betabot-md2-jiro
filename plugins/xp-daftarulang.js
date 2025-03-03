const { createHash } = require('crypto');

let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.sender];

  // Jika pengguna sudah terdaftar, tidak perlu unreg dan bisa langsung daftar ulang
  if (user.registered === true) {
    // Jika ingin mengubah data, biarkan pengguna mengisi ulang data tertentu.
    if (!text) throw `❌ Format salah!\nGunakan format:\n*${usedPrefix}daftarulang <nama>.<tahunLahir>.<agama>.<kota>*`;

    // Pemisahan input menggunakan titik (.)
    let [name, tahunLahir, agama, kota] = text.split('.');

    // Validasi nama
    if (!name) throw '⚠️ Nama tidak boleh kosong dan hanya boleh alphanumeric!';

    // Validasi tahun lahir dan pastikan inputnya adalah angka
    if (!tahunLahir || isNaN(tahunLahir)) {
      throw '⚠️ Tahun lahir harus berupa angka!';
    }

    // Validasi agama
    if (!agama) throw '⚠️ Agama tidak boleh kosong!';

    // Validasi kota
    if (!kota) throw '⚠️ Nama kota tidak boleh kosong!';

    // Parsing tahun lahir menjadi angka
    tahunLahir = parseInt(tahunLahir);
    let currentYear = new Date().getFullYear();
    let umur = currentYear - tahunLahir;

    // Validasi umur
    if (umur > 120) throw '🚫 Umur terlalu tua untuk mendaftar!';
    if (umur < 5) throw '🚫 Bayi tidak bisa mendaftar!';

    // Validasi tahun lahir (harus antara 1900 dan tahun sekarang)
    if (tahunLahir > currentYear || tahunLahir < 1900) {
      throw `🚫 Tahun lahir tidak valid! Harus antara 1900-${currentYear}`;
    }

    // Memperbarui data yang sudah ada tanpa menghapus data sebelumnya
    user.name = name.trim();
    user.age = umur;
    user.agama = agama.trim();
    user.kota = kota.trim();
    user.tahunLahir = tahunLahir;
    user.regTime = +new Date;
    user.registered = true;

    // Membuat Serial Number
    let sn = createHash('md5').update(m.sender).digest('hex');

    // Membuat pesan konfirmasi pendaftaran ulang
    let caption = `
╭───「 *USER INFORMATION* 」
│
│ 📛 *Nama:* ${name}
│ 🎂 *Umur:* ${umur} tahun
│ 📅 *Tahun Lahir:* ${tahunLahir}
│ 🛐 *Agama:* ${agama}
│ 🏙️ *Kota:* ${kota}
│ 🆔 *Serial Number:* 
│ ${sn}
│
╰─────────────────────
Terima kasih telah melakukan pendaftaran ulang! Untuk melihat semua list menu, ketikkan *${usedPrefix}menu*.
`.trim();

    // Mengirim file (gambar/video) beserta informasi registrasi
    let imageUrl = 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/j8qz0zz6.mp4';
    conn.sendFile(m.chat, imageUrl, null, caption, m);
  } else {
    throw `❌ Anda belum terdaftar!\nGunakan perintah *${usedPrefix}daftar <nama>.<tahunLahir>.<agama>.<kota>* untuk mendaftar terlebih dahulu.`;
  }
};

handler.help = ['daftarulang'].map(v => v + ' <nama>.<tahunLahir>.<agama>.<kota>');
handler.tags = ['xp'];
handler.command = /^(daftarulang|regulang)$/i;

module.exports = handler;