const fetch = require('node-fetch');

let handler = async (m, { text }) => {
    if (!text) return m.reply('❌ Masukkan teks untuk mendapatkan jawaban dari AI!');

    let url = `https://api.siputzx.my.id/api/ai/teachanything?content=${encodeURIComponent(text)}`;
    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.status) {
            m.reply(`${data.data}`);
        } else {
            m.reply('⚠️ Terjadi kesalahan saat mengambil data dari API.');
        }
    } catch (error) {
        console.error(error);
        m.reply('🚫 Gagal terhubung ke API, coba lagi nanti.');
    }
};

handler.help = ['teach <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(teach|ajarin|belajar)$/i;

module.exports = handler;