const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');

let handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args[0]) {
        return m.reply(`× Yang anda input salah\n\n> Masukkan teks untuk video stiker!\n\nContoh: ${usedPrefix + command} Boneka Salju`);
    }

    const text = args.join(' '); // Gabungkan teks argumen
    const apiKey = '${btc}'; // Ganti dengan API key Anda
    const apiUrl = `https://api.botcahx.eu.org/api/maker/brat-video?text=${encodeURIComponent(text)}&apikey=${btc}`;
    const tempPath = path.resolve(__dirname, 'temp');
    const tempVideoPath = path.join(tempPath, 'video.mp4');

    try {
        // Buat folder sementara jika belum ada
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }

        // Unduh video dari API
        const response = await axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        // Simpan video sementara
        fs.writeFileSync(tempVideoPath, response.data);

        // Kirim video sebagai stiker
        let encmedia = await conn.sendVideoAsSticker(m.chat, tempVideoPath, m, {
            packname: global.packname || 'Zephyr Pack',
            author: global.author || 'Made Power By Jiro',
        });

        // Hapus file sementara
        fs.unlinkSync(tempVideoPath);
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err);
        m.reply('❌ Gagal membuat stiker. Pastikan API key valid atau coba lagi nanti.');
    }
};

handler.help = ['bratvideo2 <teks>'];
handler.tags = ['sticker'];
handler.command = /^(bratvideo2)$/i;
handler.limit = true;

module.exports = handler;