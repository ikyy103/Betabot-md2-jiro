let fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('❌ *Contoh Penggunaan:* .bingvideo Mbappe skills');

    let query = encodeURIComponent(args.join(" "));
    let apiUrl = `https://vapis.my.id/api/bingvd?q=${query}`;

    try {
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) return m.reply('❌ Gagal menemukan video.');

        let result = json.data.map((v, i) => 
            `🎥 *${v.title}*\n` +
            `⏳ Durasi: ${v.duration}\n` +
            `👁️ Views: ${v.views}\n` +
            `📅 Upload: ${v.date}\n` +
            `📺 Channel: ${v.channel}\n` +
            `🔗 [Tonton Video](${v.link})\n`
        ).join("\n━━━━━━━━━━━━\n");

        m.reply(`🔍 *Hasil Pencarian Video Bing:*\n\n${result}`);
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat mencari video.');
    }
};

handler.help = ['bingvideo <kata kunci>'];
handler.tags = ['internet'];
handler.command = /^bingvideo$/i;

module.exports = handler;