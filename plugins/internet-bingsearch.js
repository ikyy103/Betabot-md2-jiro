let fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('❌ *Contoh Penggunaan:* .bingsearch Mbappe');

    let query = encodeURIComponent(args.join(" "));
    let apiUrl = `https://vapis.my.id/api/bingsrc?q=${query}`;

    try {
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) return m.reply('❌ Gagal menemukan informasi.');

        let result = json.data.map((v, i) => 
            `📰 *${v.title}*\n` +
            `📌 ${v.snippet}\n` +
            `🔗 [Baca Selengkapnya](${v.link})\n`
        ).join("\n━━━━━━━━━━━━\n");

        m.reply(`🔍 *Hasil Pencarian Informasi Bing:*\n\n${result}`);
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat mencari informasi.');
    }
};

handler.help = ['bingsearch <kata kunci>'];
handler.tags = ['internet'];
handler.command = /^bingsearch$/i;

module.exports = handler;