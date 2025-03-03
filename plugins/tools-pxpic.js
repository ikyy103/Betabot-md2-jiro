const axios = require('axios');
const FormData = require('form-data');

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw '❌ Tidak ada media yang ditemukan!';

  let media = await q.download();
  let fileSizeLimit = 15 * 1024 * 1024; // Maksimal 15MB

  if (media.length > fileSizeLimit) {
    throw '❌ Ukuran file melebihi batas 15MB!';
  }

  let isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

  let form = new FormData();
  form.append('file', media, { filename: 'upload' });

  try {
    await m.reply('⏳ *Sedang mengunggah ke Pxpic, harap tunggu...*');

    let { data } = await axios.post('https://pxpic.com/getSignedUrl', {
      folder: "uploads",
      fileName: 'upload'
    }, {
      headers: { 
        ...form.getHeaders(),
        'Content-Type': 'application/json'
      }
    });

    if (!data.presignedUrl) throw '❌ Gagal mendapatkan signed URL!';

    await axios.put(data.presignedUrl, media, {
      headers: { 'Content-Type': mime }
    });

    let uploadedUrl = `https://api.betabotz.eu.org/api/tools/upload`;

    m.reply(`✔️ *Upload Berhasil!*\n📂 *Link:* ${uploadedUrl}\n📦 *Ukuran:* ${media.length} Byte(s)\n⏳ *Expired:* ${isImageOrVideo ? 'Tidak Ada' : '24 Jam'}`);
  } catch (e) {
    console.error(e);
    throw '❌ Terjadi kesalahan saat mengunggah file';
  }
};

handler.help = ['pxpic <reply media>'];
handler.tags = ['tools'];
handler.command = /^(pxpic)$/i;

module.exports = handler;