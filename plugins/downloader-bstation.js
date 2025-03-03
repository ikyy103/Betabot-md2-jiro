let fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `🚀 Masukkan URL video dari Bilibili!\n\nContoh: *${usedPrefix + command} https://www.bilibili.tv/id/video/4792971833643520*`;

    let url = args[0];
    let apiUrl = `https://fastrestapis.fasturl.cloud/downup/bstationdown?url=${encodeURIComponent(url)}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200) throw `× Gagal mengambil data. Pastikan URL valid dan coba lagi!`;

        let videoData = {
            title: data.result.metadata.title || "Bilibili Video",
            image: data.result.metadata.thumbnail,
            views: data.result.metadata.view,
            likes: data.result.metadata.like,
            downloadUrl: data.result.download.url
        };

        let caption = `🎬 *${videoData.title}*\n👀 ${videoData.views} | ❤️ ${videoData.likes}\n\n🔗 *Link Download:* ${videoData.downloadUrl}`;

        // Menampilkan Thumbnail
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: videoData.title,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: videoData.image,
                        sourceUrl: videoData.downloadUrl
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        // Mengirim Video
        await conn.sendMessage(m.chat, {
            video: {
                url: videoData.downloadUrl
            },
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    title: videoData.title,
                    body: "",
                    thumbnailUrl: videoData.image,
                    sourceUrl: videoData.downloadUrl,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        });

    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat mengambil video. Coba lagi nanti!" }, { quoted: m });
    }
};

handler.help = ['bstation <url>'];
handler.tags = ['downloader'];
handler.command = /^bstation$/i;
handler.limit = true;

module.exports = handler;