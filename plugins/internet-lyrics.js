let fetch = require('node-fetch');

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw `Gunakan format: ${usedPrefix + command} <judul lagu>`;

    let query = encodeURIComponent(text);
    let url = `https://api.ryzendesu.vip/api/search/lyrics?query=${query}`;

    try {
        let res = await fetch(url);
        if (!res.ok) throw `Gagal mengambil data, coba lagi nanti.`;

        let json = await res.json();
        if (!json.length) throw `Lirik tidak ditemukan.`;

        // Ambil hasil pertama dari array json
        let song = json[0]; 
        let caption = `*${song.trackName} - ${song.artistName}*\n\n${song.plainLyrics}`;

        m.reply(caption);
    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan, coba lagi nanti.`);
    }
};

handler.help = ['lyrics <judul lagu>'];
handler.tags = ['music'];
handler.command = /^lyrics$/i;
handler.limit = true;

module.exports = handler;