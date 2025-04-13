const fs = require('fs');

const handler = async (m, { conn }) => {
    let json;
    try {
        json = JSON.parse(fs.readFileSync('./lib/json/storymusic.json'));
    } catch (e) {
        return conn.reply(m.chat, 'Gagal membaca file JSON storymusic.json', m);
    }

    if (!json.videos || !Array.isArray(json.videos) || json.videos.length === 0) {
        return conn.reply(m.chat, 'Tidak ada video dalam daftar story.', m);
    }

    const randomVideo = json.videos[Math.floor(Math.random() * json.videos.length)];

    await conn.sendMessage(m.chat, {
        video: { url: randomVideo },
        caption: `🎵 *Story music*`
    }, { quoted: m });
};

handler.command = ['storymusic', 'storymusik'];
handler.tags = ['fun'];
handler.help = ['storymusic'];
handler.group = false;

module.exports = handler;