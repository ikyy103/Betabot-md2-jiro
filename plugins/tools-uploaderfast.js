const axios = require('axios');
const FormData = require('form-data');

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw '❌ Tidak ada media yang ditemukan';

  let media = await q.download();
  let fileSizeLimit = 15 * 1024 * 1024; // Maksimal 15MB

  if (media.length > fileSizeLimit) {
    throw '❌ Ukuran media tidak boleh melebihi 15MB';
  }

  let form = new FormData();
  form.append('file', media, { filename: 'upload' });

  try {
    let { data } = await axios.post('https://fastrestapis.fasturl.cloud/downup/uploader-v2', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    if (data.status === 200) {
      m.reply(`✅ *Upload Berhasil!*\n📂 *Link:* ${data.result}\n📦 *Ukuran:* ${media.length} Byte(s)`);
    } else {
      throw '❌ Upload gagal, coba lagi nanti';
    }
  } catch (e) {
    console.error(e);
    throw '❌ Terjadi kesalahan saat mengunggah file';
  }
};

handler.help = ['uploadfast <reply media>'];
handler.tags = ['tools'];
handler.command = /^(uploadfast)$/i;

module.exports = handler;