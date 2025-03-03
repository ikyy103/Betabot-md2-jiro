const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://youtu.be/IcrbM1l_BoI`;    

    try {
        m.reply('Sedang memproses, mohon tunggu...');
        const response = await axios.get(`https://api.siputzx.my.id/api/dl/youtube/mp3?url=${text}`);
        const res = response.data;

        if (!res.status) throw 'Gagal mengambil data. Pastikan URL yang dimasukkan valid.';
        
        const mp3Url = res.data;
        let caption = `*Berhasil Mendapatkan Audio!*\n\n*URL:* ${text}`;

        await conn.sendMessage(m.chat, { 
            audio: { url: mp3Url },
            mimetype: 'audio/mpeg',
            ptt: false // Ubah ke `true` jika ingin mengirimkan sebagai voice note
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses permintaan Anda.';
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3|ytaudio)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;

module.exports = handler;