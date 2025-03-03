const fetch = require("node-fetch");

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("🚨 *Error:* Masukkan URL video SnackVideo!\n\n*Contoh:* `.snackvideo https://www.snackvideo.com/@username/video/1234567890`");

    let url = args[0];
    let apiUrl = `https://fastrestapis.fasturl.cloud/downup/snackvideodown?url=${encodeURIComponent(url)}`;

    try {
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (json.status !== 200) return m.reply("❌ *Error:* Gagal mengunduh video!");

        let { title, thumbnail, media, author, authorImage, like, comment, share } = json.result;

        let caption = `🎬 *SnackVideo Downloader*\n\n`
            + `📌 *Judul:* ${title}\n`
            + `👤 *Author:* ${author}\n`
            + `👍 *Like:* ${like}\n`
            + `💬 *Komentar:* ${comment}\n`
            + `🔄 *Dibagikan:* ${share}`;

        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: caption 
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
            video: { url: media }, 
            mimetype: "video/mp4", 
            caption: "🎥 *Berikut adalah video yang berhasil diunduh!*"
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("❌ *Error:* Gagal mengunduh video. Coba lagi nanti!");
    }
};

handler.help = ["snackvideo <url>"];
handler.tags = ["downloader"];
handler.command = /^snackvideo$/i;

module.exports = handler;