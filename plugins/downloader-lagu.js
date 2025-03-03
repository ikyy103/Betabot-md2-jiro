let search = require("yt-search");
let axios = require("axios");

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw '⚠️ Enter Title or Link From YouTube!';
    try {
        const look = await search(text);
        const convert = look.videos[0];
        if (!convert) throw '⚠️ Video/Audio Tidak Ditemukan!';
        if (convert.seconds >= 3600) {
            return conn.reply(m.chat, '⚠️ Video is longer than 1 hour!', m);
        } else {
            let audioUrl;
            try {
                audioUrl = await youtube(convert.url); // Ambil URL Audio
            } catch (e) {
                conn.reply(m.chat, '⚠️ Please wait...', m);
                audioUrl = await youtube(convert.url); // Coba ulang
            }

            // Informasi untuk pengguna
            let caption = `🎵 *Audio Downloaded*\n\n`;
            caption += `∘ *Title* : ${convert.title}\n`;
            caption += `∘ *Duration* : ${convert.timestamp}\n`;
            caption += `∘ *Uploaded* : ${convert.ago}\n`;
            caption += `∘ *Views* : ${convert.views}\n`;
            caption += `∘ *Author* : ${convert.author.name}\n`;
            caption += `∘ *Channel* : ${convert.author.url}\n`;

            await conn.reply(m.chat, caption, m); // Kirim pesan teks

            // Kirim Audio
            await conn.sendMessage(m.chat, {
                audio: {
                    url: audioUrl.result.mp3
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: m
            });
        }
    } catch (e) {
        conn.reply(m.chat, `*Error:* ${e.message}`, m);
    }
};

handler.command = handler.help = ['carikan', 'sound', 'lagu'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;

async function youtube(url) {
    try {
        const { data } = await axios.get(`https://api.botcahx.eu.org/api/dowloader/yt?url=${url}&apikey=Alwaysjiro`);
        return data;
    } catch (e) {
        throw new Error('❌ Failed to fetch audio URL.');
    }
}