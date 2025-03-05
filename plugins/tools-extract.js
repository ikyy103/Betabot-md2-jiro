const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`× *Reply file yang ingin diekstrak!*\n📌 Contoh: \`${usedPrefix + command}\``);

    let mime = m.quoted.mimetype || '';
    let media = await m.quoted.download();
    if (!media) return m.reply("× Gagal mendownload file!");

    let ext = mime.split('/')[1] || 'unknown';
    let outputPath = path.join(__dirname, '../tmp/', `output_${Date.now()}.${ext}`);
    fs.writeFileSync(outputPath, media);

    if (/text|plain|json|csv|xml/.test(mime) || ext === 'txt' || ext === 'json' || ext === 'csv' || ext === 'xml') {
        let textContent = fs.readFileSync(outputPath, 'utf8');
        m.reply(`📄 *Isi File Teks:*\n\n${textContent}`);
    } else if (/image/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `extracted.${ext}`, ` *Gambar berhasil diekstrak!*`, m);
    } else if (/audio/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `extracted.${ext}`, `🎵 *Audio berhasil diekstrak!*`, m, { ptt: false });
    } else if (/video/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `extracted.${ext}`, `🎥 *Video berhasil diekstrak!*`, m);
    } else if (/application/.test(mime)) {
        await conn.sendFile(m.chat, outputPath, `extracted.${ext}`, `📂 *File berhasil diekstrak!*`, m);
    } else {
        m.reply("*Format file tidak dikenal!* Bot akan tetap mengirimkan file dalam format aslinya....");
        await conn.sendFile(m.chat, outputPath, `unknown.${ext}`, `📦 *File berhasil dikirim!*`, m);
    }

    fs.unlinkSync(outputPath);
};

handler.command = ['extract'];
handler.tags = ['tools'];
handler.help = ['extract'];
handler.limit = true;

module.exports = handler;