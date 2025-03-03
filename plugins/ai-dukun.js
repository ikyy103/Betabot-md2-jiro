const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `❌ _*Masukkan Nama nya om :^*_ .\n\nContoh: *${usedPrefix + command} Yanto*`;

    try {
        // Panggil API Dukun AI
        let apiUrl = `https://api.siputzx.my.id/api/ai/dukun?content=${encodeURIComponent(text)}`;
        let response = await axios.get(apiUrl);

        if (!response.data || !response.data.result) {
            throw '❌ Gagal mendapatkan respons dari API.';
        }

        // Kirim hasilnya ke pengguna
        m.reply(`🔮 *Dukun AI Menjawab:*\n\n${response.data.result}`);
    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.');
    }
};

handler.help = ['dukun <Nama>'];
handler.tags = ['fun'];
handler.command = /^(dukun)$/i;

module.exports = handler;