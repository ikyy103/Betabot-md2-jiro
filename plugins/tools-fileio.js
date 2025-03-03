const axios = require('axios');
const fs = require('fs');

let handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.mimetype) return m.reply(`Kirim atau reply file dengan perintah: *uploadfileio*`);

    let media = await conn.downloadAndSaveMediaMessage(m.quoted);
    let stream = fs.createReadStream(media);

    try {
        let { data } = await axios.post('https://www.file.io/', stream, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        let url = data.link || data.url;
        m.reply(`🎉 *File Berhasil Diupload!*\n\n📎 *Link:* ${url}\n⏳ *Berlaku:* 1x Download (Expired otomatis)`);
    } catch (err) {
        console.error(err);
        return m.reply('Terjadi kesalahan saat mengunggah file.');
    }

    fs.unlinkSync(media); // Hapus file lokal setelah upload
};

handler.help = ['fileio'];
handler.tags = ['tools'];
handler.command = /^(fileio)$/i;

module.exports = handler;