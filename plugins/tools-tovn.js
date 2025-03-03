const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || '';

        if (!/video|audio/.test(mime)) {
            return m.reply(`🚩 *Balas video/audio* yang ingin diubah menjadi VN dengan caption *${usedPrefix + command}*`);
        }

        let media = await q.download?.();
        if (!media) {
            return m.reply('🚩 *Gagal mengunduh media!*');
        }

        let inputPath = path.resolve('tmp', `input_${m.sender}.mp4`);
        let outputPath = path.resolve('tmp', `output_${m.sender}.opus`);

        // Simpan file sementara di folder tmp/
        fs.writeFileSync(inputPath, media);

        // Cek apakah file berhasil dibuat sebelum diproses
        if (!fs.existsSync(inputPath)) {
            return m.reply(`🚩 *File input tidak ditemukan setelah diunduh!*`);
        }

        exec(`ffmpeg -i "${inputPath}" -vn -acodec libopus -b:a 48k "${outputPath}"`, async (err, stdout, stderr) => {
            if (err) {
                console.error(`🚩 Error FFmpeg:\n${stderr}`);
                return m.reply(`🚩 *Gagal mengonversi video ke VN!*\n\n*Error:*\n${stderr}`);
            }

            // Kirim hasil sebagai VN
            await conn.sendMessage(m.chat, { audio: fs.readFileSync(outputPath), mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
            
            // Hapus file sementara setelah dikirim
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (e) {
        console.error(`🚩 Error:\n${e}`);
        m.reply(`🚩 *Terjadi kesalahan saat memproses VN!*\n\n*Error:*\n${e.message}`);
    }
}

handler.help = ['tovn'];
handler.tags = ['tools'];
handler.command = /^to(vn|(ptt)?)$/i;

module.exports = handler;