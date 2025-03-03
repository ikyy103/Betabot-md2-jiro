const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Panggil API untuk mendapatkan jadwal TV
        const response = await fetch('https://api.siputzx.my.id/api/info/jadwaltv');
        const json = await response.json();

        // Periksa apakah API berhasil memberikan data
        if (!json.status || !json.data) throw 'Data jadwal TV tidak ditemukan atau terjadi kesalahan pada API.';

        // Ambil data dari respon API
        const jadwalTv = json.data;

        // Format pesan
        let text = `📺 *Jadwal TV Hari Ini* 📺\n\n`;
        for (const channel of jadwalTv) {
            text += `🌟 *${channel.channel}*\n`;
            for (const acara of channel.jadwal) {
                text += `🕒 ${acara.jam} - ${acara.acara}\n`;
            }
            text += '\n';
        }

        // Kirim pesan ke pengguna
        m.reply(text.trim());
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan atau data jadwal TV tidak ditemukan.');
    }
};

handler.help = ['jadwaltv'];
handler.tags = ['info'];
handler.command = /^(jadwaltv|tv)$/i;

module.exports = handler;