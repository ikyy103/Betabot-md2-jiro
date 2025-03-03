const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`*『 GAGAL 』*\n\nGunakan format: \n${usedPrefix}igs <username>\n\n*Contoh:* ${usedPrefix}igs satriaonly2024`);

    try {
        let apiUrl = `https://bk9.fun/download/igs?username=${text}`;
        let { data } = await axios.get(apiUrl);

        if (!data.status || !data.BK9.length) return m.reply(`❌ Tidak ditemukan Instagram Story untuk *${text}*!`);

        for (let item of data.BK9) {
            if (item.type === "image") {
                await conn.sendFile(m.chat, item.url, 'story.jpg', `📸 *Instagram Story*\n👤 *Username:* ${text}`, m);
            } else if (item.type === "video") {
                await conn.sendFile(m.chat, item.url, 'story.mp4', `🎥 *Instagram Story*\n👤 *Username:* ${text}`, m);
            }
        }
    } catch (e) {
        console.error(e);
        m.reply('⚠️ Terjadi kesalahan, coba lagi nanti!');
    }
};

handler.help = ['igs <username>'];
handler.tags = ['downloader'];
handler.command = /^(igs)$/i;
handler.limit = 2;

module.exports = handler;