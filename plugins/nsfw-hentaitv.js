const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`⚠️ Gunakan format: *${usedPrefix + command} <nama_hentai>*\n\nContoh: *${usedPrefix + command} loli*`);

    let query = args.join(" ");
    let apiUrl = `https://fastrestapis.fasturl.cloud/sfwnsfw/hentaitv?name=${encodeURIComponent(query)}`;

    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: "🔍",
                key: m.key,
            },
        });

        let response = await axios.get(apiUrl);
        let data = response.data;

        if (data.status !== 200 || !data.result || data.result.length === 0) throw "⚠️ Tidak ditemukan hasil untuk pencarian ini!";

        let randomResult = data.result[Math.floor(Math.random() * data.result.length)];

        let caption = `🔞 *HentaiTV Search*\n\n📺 *Judul:* ${randomResult.title}\n👁 *Views:* ${randomResult.views}\n🔗 *Tonton:* ${randomResult.url}\n\n> dosa tanggung sendiri`;

        await conn.sendMessage(m.chat, { 
            image: { url: randomResult.thumbnail }, 
            caption 
        });

        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key,
            },
        });

    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mencari data!");
    }
};

handler.help = ["hentaitv"];
handler.tags = ["nsfw"];
handler.command = ["hentaitv", "hsearch"];

handler.nsfw = true;

module.exports = handler;