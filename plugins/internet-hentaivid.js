const axios = require('axios');

let handler = async (m, { conn }) => {
    try {
        // Mengambil data dari API
        const response = await axios.get('https://api.vreden.my.id/api/hentaivid');
        const data = response.data;

        if (data.status !== 200) throw `Gagal mengambil data!`;

        // Mengambil video pertama dari hasil
        const videoData = data.result[0];
        const { title, video_1, views_count, share_count } = videoData;

        // Membuat caption untuk video
        let capt = `乂 *VIDEO HENTAI*\n\n`;
        capt += `◦ *Judul* : ${title}\n`;
        capt += `◦ *Views* : ${views_count}\n`;
        capt += `◦ *Shares* : ${share_count}\n`;
        capt += `\n`;

        // Mengirim video ke pengguna
        await conn.sendFile(m.chat, video_1, null, capt, m);
    } catch (e) {
        console.log(e);
        throw `🚩 Terjadi kesalahan: ${e.message}`;
    }
};

handler.help = ['hentaivid'];
handler.tags = ['internet'];
handler.command = /^(hentaivid)$/i;
handler.limit = true;
handler.register = false;
handler.premium = true;

module.exports = handler;