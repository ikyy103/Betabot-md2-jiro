const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Panggil API
        const response = await fetch(`https://api.siputzx.my.id/api/r/quotesanime`);
        const json = await response.json();

        // Periksa apakah API mengembalikan hasil
        if (!json || !json.data || json.data.length === 0) throw 'Maaf, tidak ada data yang ditemukan.';

        // Ambil data dari respon API
        const { karakter, anime, episode, quotes, gambar, link } = json.data[0];

        // Format pesan
        const text = `
🌟 *Quotes Anime* 🌟
🧑 *Karakter*: ${karakter}
📺 *Anime*: ${anime}
🎥 *Episode*: ${episode}
💬 *Quotes*: ${quotes}

🔗 Info selanjutnya : (${link})
`.trim();

        // Kirim pesan dengan thumbnail
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: text,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `${karakter} - ${anime}`,
                        body: quotes,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: gambar,
                        sourceUrl: link,
                    },
                },
            },
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('Maaf, terjadi kesalahan saat memproses permintaan Anda.');
    }
};

handler.help = ['quotesanime'];
handler.tags = ['quotes'];
handler.command = /^(quotesanime)$/i;

module.exports = handler;