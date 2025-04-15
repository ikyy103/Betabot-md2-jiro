const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const mime = require('mime-types');

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime_type = (q.msg || q).mimetype || '';
  
  if (!mime_type) return conn.sendMessage(m.key.remoteJid, { text: `Kirim/balas gambar/video/file dengan caption ${usedPrefix + command}` }, { quoted: m });
  
  // Mengganti m.react dengan conn.sendMessage untuk memberikan respons
  await conn.sendMessage(m.key.remoteJid, { text: '⌛ Proses upload...' }, { quoted: m });
  
  try {
    let media = await q.download();
    let filename = `file_${Date.now()}`;
    let ext = mime_type.split('/')[1];
    let path = `./tmp/${filename}.${ext}`;
    
    fs.writeFileSync(path, media);
    
    let quaxUrl = await Quax(path);
    
    await conn.sendMessage(m.key.remoteJid, { text: `✅ Upload berhasil! URL: ${quaxUrl}` }, { quoted: m });
    
    fs.unlinkSync(path);
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.key.remoteJid, { text: 'Gagal Upload' }, { quoted: m });
  }
};

async function Quax(path) {
  try {
    const form = new FormData();
    const ext = path.split('.').pop();
    const mimeType = mime.lookup(ext) || 'application/octet-stream';

    form.append('files[]', fs.createReadStream(path), {
      filename: `v-${Date.now()}.${ext}`,
      contentType: mimeType
    });

    const { data } = await axios({
      method: 'POST',
      url: 'https://qu.ax/upload.php',
      headers: form.getHeaders(),
      data: form
    });

    return data.files[0].url;
  } catch (err) {
    throw Error(err.message);
  }
}

handler.help = ['quaxup'];
handler.command = ['quaxup', 'quaxcdn'];
handler.tags = ['tools', 'uploader'];

module.exports = handler;