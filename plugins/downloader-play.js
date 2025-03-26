let search = require("yt-search");
let axios = require("axios");

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw "Masukkan judul lagu atau link YouTube!";
    
    try {
        const look = await search(text);
        const video = look.videos[0];

        if (!video) throw "⚠️ Video/Audio tidak ditemukan!";
        if (video.seconds >= 3600) return conn.reply(m.chat, "⚠️ Video lebih dari 1 jam tidak dapat diunduh!", m);

        let videoUrl = video.url;
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
        const result = await axios.get(apiUrl);
        
        if (!result.data || result.data.status !== 200 || !result.data.result || !result.data.result.media) {
            return m.reply("⚠️ Tidak ada format audio yang tersedia atau URL salah.");
        }

        const { title, metadata, author, media, quality } = result.data.result;

        let caption = `
🎵 *Judul:* ${title}
📺 *Channel:* ${author.name}
⏱️ *Durasi:* ${metadata.duration}
👀 *Views:* ${metadata.views}
📆 *Upload:* ${metadata.uploadDate}
🎼 *Kualitas:* ${quality}
🔗 *URL:* ${result.data.result.url}
`.trim();

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: metadata.thumbnail,
                        sourceUrl: videoUrl
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        m.reply("📥 Mengunduh audio...");
        const audioResponse = await axios.get(media, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, {
            audio: audioResponse.data,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "",
                    thumbnailUrl: metadata.thumbnail,
                    sourceUrl: videoUrl,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        m.reply(`⚠️ Terjadi kesalahan: ${e.message}`);
    }
};

handler.command = ['play', 'ds', 'song'];
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

module.exports = handler;