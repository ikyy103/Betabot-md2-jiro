const axios = require('axios');
const FormData = require('form-data');

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!mime) throw '❌ Tidak ada media yang ditemukan!';

  let media = await q.download();
  let fileSizeLimit = 15 * 1024 * 1024; // Maksimal 15MB

  if (media.length > fileSizeLimit) {
    throw '❌ Ukuran media tidak boleh melebihi 15MB!';
  }

  let form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', media, 'upload');

  try {
    let { data } = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    if (data.includes("https://files.catbox.moe")) {
      m.reply(`✅ *Upload Berhasil!*\n📂 *Link:* ${data}`);
    } else {
      throw '❌ Upload gagal, coba lagi nanti!';
    }
  } catch (e) {
    console.error(e);
    throw '❌ Terjadi kesalahan saat mengunggah file!';
  }
};

handler.help = ['catbox <reply media>'];
handler.tags = ['tools'];
handler.command = /^(catbox)$/i;

module.exports = handler;