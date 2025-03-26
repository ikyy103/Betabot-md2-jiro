*/ `YTMP3`
API : https://fastrestapis.fasturl.cloud/
Weem :
https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W
&
https://whatsapp.com/channel/0029VasQWtS4NVig014W6v17
/*

const fetch = require('node-fetch');
const axios = require('axios');

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
    if (!text) {
        return m.reply("Contoh:\n!ytmp3 https://youtu.be/xyz123\natau\n!ytmp3 cari judul lagu");
    }

    m.reply("⏳ Tunggu sebentar, sedang mengambil data...");

    let videoUrl = text;
    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i.test(text)) {
        const yts = await import('yt-search');
        const searchResult = await yts.default(text);
        const randomVideo = searchResult.videos[0];

        if (!randomVideo) {
            return m.reply("⚠️ Video tidak ditemukan, coba pakai kata kunci lain.");
        }

        videoUrl = randomVideo.url;
    }

    const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
    const result = await fetchJson(apiUrl);

    if (!result || result.status !== 200 || !result.result || !result.result.media) {
        return m.reply("⚠️ Tidak ada format audio yang tersedia atau URL salah.");
    }

    const { title, metadata, author, media, quality } = result.result;
    const caption = `
🎵 *Judul:* ${title}
📺 *Channel:* ${author.name}
⏱️ *Durasi:* ${metadata.duration}
👀 *Views:* ${metadata.views}
📆 *Upload:* ${metadata.uploadDate}
🎼 *Kualitas:* ${quality}
🔗 *URL:* ${result.result.url}
    `.trim();

    try {
        await conn.sendMessage(m.chat, {
            image: { url: metadata.thumbnail },
            caption,
            mentions: [m.sender]
        }, { quoted: m });

        m.reply("📥 Mengunduh audio...");
        const response = await axios.get(media, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, {
            audio: response.data,
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error("❌ Error:", err);
        m.reply("❌ Terjadi kesalahan saat mengunduh atau mengirim audio.");
    }
}

handler.command = /^(ytmp3|yta)$/i;
handler.help = ["ytmp3"].map(v => v + " *<url atau judul>*");
handler.tags = ["downloader"];
handler.register = true;
handler.limit = true;

module.exports = handler;