const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
    // Mengambil data dari API
    let response = await fetch(`https://api.betabotz.eu.org/api/wallpaper/couplepp?apikey=${lann}`);
    let data = await response.json();

    // Memeriksa status API
    if (!data.status) {
        return m.reply('Maaf, terjadi kesalahan saat mengambil data.'); // Pesan jika status tidak true
    }

    // Mendapatkan URL gambar
    let { male, female } = data.result;

    // Mengirim gambar
    await conn.sendFile(m.chat, male, 'male_profile.jpg', '𝙱𝚘𝚢𝚜', m);
    await conn.sendFile(m.chat, female, 'female_profile.jpg', '𝙶𝚒𝚛𝚕𝚜', m);
}

handler.help = ['ppcp'];
handler.tags = ['internet'];
handler.command = /^(ppcouple2)|ppcp$/i;

module.exports = handler;