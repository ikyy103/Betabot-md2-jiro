const axios = require('axios');

let handler = async (m, { conn, command }) => {
    try {
        let apiKey = "apikey_lu"; // isi apikey lu dari web https://api.maelyn.tech/
        let apiUrl = `https://api.maelyn.tech/api/tempnumber/generate?apikey=${apiKey}`;

        let res = await axios.get(apiUrl);
        if (!res.data || res.data.status !== "Success") throw "❌ Gagal mendapatkan nomor sementara!";

        let result = res.data.result;

        let replyMessage = `📲 *Temp Number Generated!*\n\n` +
            `🌍 *Negara:* ${result.country_name} (${result.country_code})\n` +
            `📆 *Dibuat:* ${result.data_humans}\n` +
            `📞 *Nomor Penuh:* ${result.full_number}\n` +
            `📟 *Nomor Tanpa +:* ${result.number_without_plus}\n` +
            `🔢 *Nomor Murni:* ${result.number_pure}\n` +
            `📦 *Arsip:* ${result.is_archive ? "✅ Ya" : "❌ Tidak"}`;

        m.reply(replyMessage);
    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat menghasilkan nomor sementara!");
    }
};

handler.command = ['tmpnumber', 'tmphp', 'tmpphone'];
handler.tags = ['tools'];
handler.help = ['tmpnumber', 'tmphp', 'tmpphone'];
handler.limit = true;

module.exports = handler;