const axios = require('axios');

let handler = async (m, { conn, args }) => {
    try {
        if (!args[0]) throw '⚠️ Masukkan API Key untuk dicek!\n\nContoh penggunaan: .checkapilip <apikey>';

        let apiKey = args[0]; // Mendapatkan API Key dari input
        let url = `https://api.caliph.biz.id/users/cek?apikey=${apiKey}`;

        m.reply('⏳ Sedang memeriksa API Key...');

        // Melakukan permintaan ke API
        let { data } = await axios.get(url);

        // Menampilkan hasil
        if (data.status === true) {
            let replyMessage = `
✅ *API Key Valid*

🔑 *Key:* ${data.apikey}
✅ *status:* ${data.status}
📊 *Usage Limit:* ${data.limit}
📅 *Expire Date:* ${data.expired}
⭐ *Premium:* ${data.premium}
👤 *username:* ${data.username}
⏱️ *sisa expired:* ${data.ago}

            `.trim();
            m.reply(replyMessage);
        } else {
            m.reply('❌ API Key Tidak Valid atau telah kedaluwarsa!');
        }
    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat memeriksa API Key. Pastikan API Key benar.');
    }
};

handler.help = ['checkapiliip <apikey>'];
handler.tags = ['tools'];
handler.command = /^checkapilip$/i;

module.exports = handler;