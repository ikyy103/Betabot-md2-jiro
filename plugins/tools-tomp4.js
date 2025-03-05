const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`× *Reply file MP4 yang ingin dijadikan video!*\n📌 Contoh: \`${usedPrefix + command}\``);

    let mime = m.quoted.mimetype || '';
    if (!/mp4/.test(mime)) return m.reply(`× File yang direply bukan format MP4!`);

    let media = await m.quoted.download();
    if (!media) return m.reply("× Gagal mendownload file MP4!");

    let inputPath = path.join(__dirname, '../tmp/', `input_${Date.now()}.mp4`);
    let outputPath = path.join(__dirname, '../tmp/', `output_${Date.now()}.mp4`);

    fs.writeFileSync(inputPath, media);

    m.reply("⏳ *Mengonversi file ke video, harap tunggu...*");

    let ffmpeg = spawn('ffmpeg', ['-i', inputPath, '-c', 'copy', outputPath]);

    ffmpeg.on('close', async (code) => {
        if (code !== 0) {
            m.reply("× Gagal mengonversi file menjadi video!");
            fs.unlinkSync(inputPath);
            return;
        }

        let buffer = fs.readFileSync(outputPath);
        await conn.sendFile(m.chat, buffer, 'converted.mp4', `✅ *Konversi berhasil!*\n🎥 Format: MP4 (Video)`, m, { mimetype: 'video/mp4' });

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
    });
};

handler.command = ['tomp4'];
handler.tags = ['tools'];
handler.help = ['tomp4'];
handler.limit = true;

module.exports = handler;