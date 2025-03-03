const axios = require("axios");

var handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan judul lagu yang ingin dicari!\n\n📌 Contoh: *play interaksi*';

    try {
        // 1. Mencari video berdasarkan judul lagu
        let searchUrl = `https://api.betabotz.eu.org/api/search/yts?query=${encodeURIComponent(text)}&apikey=Btz-op`;
        let searchResponse = await axios.get(searchUrl);
        let searchData = searchResponse.data;

        if (!searchData || !searchData.status || !searchData.result.length) {
            throw 'Lagu tidak ditemukan!';
        }

        // Ambil hasil pencarian pertama
        let video = searchData.result[0];
        let videoTitle = video.title;
        let videoUrl = video.url;
        let videoThumb = video.thumbnail;
        let videoAuthor = video.author.name;
        let videoChannel = video.author.url;
        let duration = video.duration;
        let description = video.description;
        let published = video.published_at;
        let views = video.views;

        // 2. Mengambil link download MP3 dari API
        let downloadUrl = `https://api.betabotz.eu.org/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=Btz-op`;
        let downloadResponse = await axios.get(downloadUrl);
        let downloadData = downloadResponse.data;

        if (!downloadData || !downloadData.status || !downloadData.result.mp3) {
            throw 'Gagal mengunduh lagu!';
        }

        let audioUrl = downloadData.result.mp3;

        // 3. Kirim informasi video ke pengguna
        let caption = `🎶 *𝕃𝕒𝕘𝕦 𝘿𝙞𝙩𝙚𝙢𝙪𝙠𝙖𝙣!*\n\n📌 *𝙹𝚞𝚍𝚞𝚕:* ${videoTitle}\n🎤 *𝙰𝚛𝚝𝚒𝚜:* ${videoAuthor}\n📺 *𝙲𝚑𝚊𝚗𝚗𝚎𝚕:* ${videoAuthor} - ${videoChannel}\n⏳ *𝙳𝚞𝚛𝚊𝚜𝚒:* ${duration}\n📅 *𝙳𝚒𝚛𝚒𝚕𝚒𝚜:* ${published}\n👁️ *𝙳𝚒𝚕𝚒𝚑𝚊𝚝:* ${views} kali\n🔗 *𝚄𝚛𝚕 𝚈𝚘𝚞𝚝𝚞𝚋𝚎:* ${videoUrl}\n\n• 📝 *𝙳𝚎𝚜𝚔𝚛𝚒𝚙𝚜𝚒:*\n${description}`;

        await conn.sendMessage(m.chat, {
            image: { url: videoThumb },
            caption: caption
        }, { quoted: m });

        // 4. Kirim file audio MP3
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: videoTitle,
                    body: "𝕂𝕝𝕚𝕜 𝕦𝕟𝕥𝕦𝕜 𝕞𝕖𝕟𝕠𝕟𝕥𝕠𝕟 𝕕𝕚 𝕐𝕠𝕦𝕋𝕦𝕓𝕖",
                    thumbnailUrl: videoThumb,
                    sourceUrl: videoUrl,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `❌ *Terjadi Kesalahan:*\n${e.message || e}`, m);
    }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = 3;
handler.premium = false;
handler.group = false;

module.exports = handler;