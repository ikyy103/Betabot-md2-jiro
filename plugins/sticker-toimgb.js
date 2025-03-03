const sharp = require('sharp');

let handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `Reply sticker dengan command *${usedPrefix + command}*`;

  if (!m.quoted) throw notStickerMessage;

  const q = m.quoted || m;
  const mime = q.mimetype || '';

  if (!/image\/webp/.test(mime)) throw notStickerMessage;

  try {
    // Informasikan bahwa proses sedang berlangsung
    m.reply('Sabarr......\n\n> Menghilangkan blur pada sticker, mohon tunggu...');

    // Download sticker
    const media = await q.download();

    // Proses sticker untuk menghilangkan blur menggunakan sharp
    const processedImage = await sharp(media)
      .toFormat('png') // Konversi ke PNG
      .sharpen({ sigma: 2, m1: 1, m2: 1, x1: 1 }) // Hilangkan blur dengan sharpening
      .toBuffer();

    // Kirim hasil gambar
    if (processedImage.length > 0) {
      await conn.sendFile(m.chat, processedImage, 'output.png', 'Blur berhasil dihilangkan!', m);
    } else {
      throw `Proses penghilangan blur gagal! Silakan coba lagi.`;
    }
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat memproses sticker. Silakan coba lagi.');
  }
};

handler.help = ['toimgb'];
handler.tags = ['sticker'];
handler.command = ['toimgb', 'toimageunblur'];
handler.limit = true;
handler.register = true;

module.exports = handler;