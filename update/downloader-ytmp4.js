const fetch = require('node-fetch');

const fetchJson = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Fetch JSON error:", error);
        throw error;
    }
};

async function handler(m, { text, conn }) {
    if (!text) return m.reply("Contoh:\n!ytmp4 https://youtu.be/xyz123\natau\n!ytmp4 https://youtube.com/shorts/abc123");

    try {
        m.reply("⏳ Tunggu sebentar, sedang mengambil data...");

        const resolutions = ['480', '720', '1080', '360'];
        let videoData = null;

        for (const quality of resolutions) {
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=${quality}`;
            const res = await fetchJson(apiUrl);

            if (res && res.status === 200 && res.result && res.result.media) {
                videoData = res;
                break;
            }
        }

        if (!videoData) return m.reply("⚠️ Gagal mendapatkan data. Periksa URL atau coba lagi nanti.");

        const { title, metadata, author, media, quality } = videoData.result;
        const caption = `
🎬 *Judul:* ${title}
👤 *Channel:* ${author.name}
📆 *Upload:* ${metadata.uploadDate}
⏳ *Durasi:* ${metadata.duration}
👁️ *Views:* ${metadata.views}
📥 *Resolusi:* ${quality}
🔗 *URL:* ${videoData.result.url}
        `.trim();

        await conn.sendMessage(m.chat, {
            image: { url: metadata.thumbnail },
            caption,
            mentions: [m.sender]
        }, { quoted: m });

        m.reply(`📥 Mengunduh video dalam kualitas *${quality}p*...`);
        await conn.sendMessage(m.chat, {
            video: { url: media, mimetype: 'video/mp4' },
            caption,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error("❌ Error:", err);
        m.reply("❌ Terjadi kesalahan saat mengambil data: " + err.message);
    }
}

handler.command = /^(ytmp4|ytv|mp4)$/i;
handler.help = ["ytmp4"].map(v => v + " *<url>*");
handler.tags = ["downloader"];
handler.register = true;
handler.limit = true;

module.exports = handler;