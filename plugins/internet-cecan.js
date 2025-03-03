const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
    // Daftar API cecan
    const cecanAPIs = [
        "https://api.siputzx.my.id/api/r/cecan/vietnam",
        "https://api.siputzx.my.id/api/r/cecan/thailand",
        "https://api.siputzx.my.id/api/r/cecan/korea",
        "https://api.siputzx.my.id/api/r/cecan/japan",
        "https://api.siputzx.my.id/api/r/cecan/china",
        "https://api.siputzx.my.id/api/r/cecan/indonesia"
    ];

    try {
        // Pilih API secara random
        const randomAPI = cecanAPIs[Math.floor(Math.random() * cecanAPIs.length)];

        // Ambil data dari API
        const response = await fetch(randomAPI);
        const buffer = await response.buffer();

        // Kirim gambar ke chat
        await conn.sendMessage(m.chat, { image: buffer, caption: 'Nih, cecan random untukmu!' }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('Maaf, terjadi kesalahan saat mengambil gambar.');
    }
};

handler.help = ['cecanrandom'];
handler.tags = ['internet'];
handler.command = /^(cecan|randomcecan)$/i;

module.exports = handler;