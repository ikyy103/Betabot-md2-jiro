/*
──────────────────────────────────────────
🌩️ Code by AlfiDev - CloudKuImages Uploader
📛 Jangan hapus watermark ini, hargai pembuatnya.
📦 Types: Plugins ESM + CJS
ℹ️ Notes: npm install cloudku-uploader@latest
📲 Channel: https://whatsapp.com/channel/0029VasizxI47XeE2iiave0u
Notes: Tourl Uploaders All files without php 
──────────────────────────────────────────
*/
const { uploadFile } = require('cloudku-uploader'); // Pastikan uploadFile diimpor dengan benar
const { Buffer } = require('buffer');

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        let fileBuffer, fileName;

        if (mime) {
            fileBuffer = await q.download();
            let ext = mime.split('/')[1] || 'bin';
            fileName = `upload.${ext}`;
        } else if (q.text) {
            fileBuffer = Buffer.from(q.text, 'utf-8');
            fileName = 'upload.txt';
        } else {
            return m.reply('🚨 Tidak ada media atau teks yang ditemukan!');
        }

        let loading = await m.reply('⏳ Mengupload file ke CloudKuImages...');

        const result = await uploadFile(fileBuffer, fileName);

        if (result?.status === 'success') {
            const { filename, type, size, url } = result.result;
            const infoURL = result.information || 'https://cloudkuimages.com/ch';

            let caption = `✅ *Upload Berhasil!*\n\n` +
                          `📮 *URL:* ${url}\n` +
                          `📂 *Nama:* ${filename}\n` +
                          `📛 *Tipe:* ${type}\n` +
                          `📊 *Ukuran:* ${size}\n` +
                          `ℹ️ *Info:* ${infoURL}`;

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: `🚨 Upload gagal.\n\nServer Response:\n${JSON.stringify(result, null, 2)}`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { delete: loading.key });

    } catch (err) {
        console.error(err);
        await m.reply('🚨 Terjadi kesalahan internal saat proses upload.');
    }
};

handler.help = ['tourl', 'upload'];
handler.tags = ['tools'];
handler.command = /^(tourl|upload)$/i;

module.exports = handler;