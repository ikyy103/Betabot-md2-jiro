const fs = require('fs');
const sharp = require('sharp');

let handler = async (m, { conn, command, usedPrefix, text }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  let blurLevel = parseInt(text) || 5; // Default blur level 5 jika tidak ada input
  
  // Validasi input tingkat blur
  if (isNaN(blurLevel) || blurLevel < 1 || blurLevel > 10) {
    return m.reply(`Masukkan angka tingkat blur antara 1 hingga 10. Contoh: *${usedPrefix + command} 5*`);
  }

  if (/image/.test(mime)) {
    let media = await q.download();

    try {
      // Proses gambar dengan tingkat blur yang diberikan
      let processedMedia = await sharp(media)
        .resize(512, 512, { 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } 
        })
        .blur(blurLevel) // Efek blur berdasarkan input
        .png()
        .toBuffer();

      // Kirim sebagai stiker
      let encmedia = await conn.sendImageAsSticker(m.chat, processedMedia, m, { packname: global.packname, author: global.author });
      await fs.unlinkSync(encmedia);
    } catch (err) {
      console.error(err);
      m.reply('Terjadi kesalahan saat memproses gambar.');
    }
  } else if (/video/.test(mime)) {
    if ((q.msg || q).seconds > 7) return m.reply('Durasi video maksimal 6 detik!');
    let media = await q.download();

    let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author });
    await fs.unlinkSync(encmedia);
  } else {
    throw `Kirim gambar dengan caption *${usedPrefix + command} [angka]* untuk menambahkan efek blur.\nContoh: *${usedPrefix + command} 5*`;
  }
};

handler.help = ['blursticker <<angka>>'];
handler.tags = ['sticker'];
handler.command = /^(blursticker|blurstiker|sb)$/i;
handler.limit = true;

module.exports = handler;