const axios = require('axios');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan pertanyaan atau pernyataan untuk Alicia!\n\nContoh:\n${usedPrefix + command} Apa itu AI?`;

    try {
        const user = m.sender.split('@')[0]; // Menggunakan nomor pengguna sebagai ID
        let response = await axios.get(`https://api.diioffc.web.id/api/ai/alicia?query=${encodeURIComponent(text)}&user=${user}`);
        let result = response.data.result || response.data.data;

        if (!result) throw 'Alicia tidak dapat memberikan jawaban saat ini.';
        m.reply(`${result}`);
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat memproses permintaan. Coba lagi nanti!');
    }
};

handler.help = ['alicia <pertanyaan/pernyataan>'];
handler.tags = ['ai'];
handler.command = /^alicia$/i;
module.exports = handler;