const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`× *Reply file dokumen yang ingin dikonversi ke media!*\n📌 Contoh: \`${usedPrefix + command}\``);

    let mime = m.quoted.mimetype || '';
    let media = await m.quoted.download();
    if (!media) return m.reply("× Gagal mendownload file!");

    let ext = '';
    if (/audio/.test(mime)) ext = '.mp3';
    else if (/image/.test(mime)) ext = '.jpg';
    else if (/text|plain/.test(mime)) ext = '.txt';
    else return m.reply("Format tidak didukung!");

    let outputPath = path.join(__dirname, '../tmp/', `output_${Date.now()}${ext}`);
    fs.writeFileSync(outputPath, media);

    let caption = `✅ *Konversi Berhasil!*\n📂 Format: ${ext.replace('.', '').toUpperCase()}`;

    if (/audio/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `converted${ext}`, caption, m, { mimetype: 'audio/mpeg', ptt: false });
    } else if (/image/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `converted${ext}`, caption, m);
    } else if (/text|plain/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `converted${ext}`, caption, m);
    }

    fs.unlinkSync(outputPath);
};

handler.command = ['tomedia'];
handler.tags = ['tools'];
handler.help = ['tomedia'];
handler.limit = true;

module.exports = handler;