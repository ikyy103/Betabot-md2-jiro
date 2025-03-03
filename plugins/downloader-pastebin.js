const axios = require('axios');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan URL Pastebin!\n\nContoh:\n${usedPrefix + command} https://pastebin.com/Geq38sT1`;

    try {
        m.reply('Mengambil data dari Pastebin, harap tunggu...');
        let response = await axios.get(`https://vapis.my.id/api/pastebin?url=${encodeURIComponent(text)}`);
        let { status, data } = response.data; // Ganti 'result' dengan 'data'

        if (!status || !data) throw 'Gagal mengambil data. Pastikan URL Pastebin valid!';
        
        await m.reply(`📋 *Data dari Pastebin:*\n\n${data}`);
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat memproses permintaan. Coba lagi nanti!');
    }
};

handler.help = ['pastebin <url>'];
handler.tags = ['downloader'];
handler.command = /^pastebin$/i;
module.exports = handler;