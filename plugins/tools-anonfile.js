const axios = require('axios');
const fs = require('fs');

let handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.mimetype) return m.reply(`Kirim atau reply file dengan perintah: *uploadanonfile*`);

    let media = await conn.downloadAndSaveMediaMessage(m.quoted);
    let stream = fs.createReadStream(media);

    try {
        let { data } = await axios.post('https://www.anonfile.la/api/upload', stream, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        let url = data.data.file.url.full;
        m.reply(`🎉 *File Berhasil Diupload!*\n\n📎 *Link:* ${url}\n✅ *Berlaku:* Tidak Ada Expired`);
    } catch (err) {
        console.error(err);
        return m.reply('Terjadi kesalahan saat mengunggah file.');
    }

    fs.unlinkSync(media); // Hapus file lokal setelah upload
};

handler.help = ['anonfile'];
handler.tags = ['tools'];
handler.command = /^(anonfile)$/i;

module.exports = handler;