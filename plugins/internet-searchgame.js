let handler = async (m, { conn, args, text }) => {
    let query = text || (m.quoted && m.quoted.text);
    
    if (!query) throw `Masukkan nama game yang ingin dicari.`;

    const apiUrl = `https://fastrestapis.fasturl.cloud/search/playstation?query=${encodeURIComponent(query)}`;
    
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status !== 200) throw `Terjadi kesalahan saat mengambil data.`;

    let results = data.result.slice(0, 5); // Ambil 5 hasil teratas

    if (results.length === 0) throw `Tidak ditemukan hasil untuk "${query}".`;

    for (let item of results) {
        let title = item.title;
        let link = item.link;
        let imageUrl = item.images;

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: `🎮 *${title}*\n🔗 Link: ${link}`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `📅 Hasil Pencarian untuk: ${query}`,
                        body: `Ditemukan ${results.length} hasil.`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: imageUrl,
                        sourceUrl: link,
                    },
                },
                mentions: [m.sender],
            },
        }, {});
    }
};

handler.help = ['searchgame *<nama game>*'];
handler.tags = ['game'];
handler.command = /^(searchgame)$/i;
handler.limit = 3

module.exports = handler;