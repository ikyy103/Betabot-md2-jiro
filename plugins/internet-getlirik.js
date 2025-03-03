let fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('❌ *Contoh Penggunaan:* .getlirik https://www.lyrics.com/lyric/32849180/Alvaro+Soler/Sofia');

    let apiUrl = `https://vapis.my.id/api/getlirik?url=${encodeURIComponent(args[0])}`;

    try {
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) return m.reply('❌ Gagal mendapatkan lirik lagu. Pastikan URL benar.');

        let { artistImage, about, year, lyrics } = json.data;
        let text = `🎵 *Lirik Lagu Ditemukan!*\n\n` +
            `📌 *Tahun Rilis:* ${year}\n\n` +
            `📜 *Tentang Artis:* ${about}\n\n` +
            `🎶 *Lirik Lagu:*\n\n${lyrics}`;

        // Ambil waktu saat ini
        let date = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        let name = m.pushName || "Pengguna";

        // Kirim pesan dengan thumbnail artis
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: text,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `📅 ${date} | ⏰ ${time} | 👤 ${name}`,
                        body: name,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: artistImage,
                        sourceUrl: args[0], // Link asli lirik
                    },
                },
            },
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat mengambil lirik.');
    }
};

handler.help = ['getlirik *<url>*'];
handler.tags = ['music','internet'];
handler.command = /^getlirik$/i;

module.exports = handler;