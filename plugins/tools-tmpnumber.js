const axios = require('axios');

let handler = async (m, { conn, command }) => {
    let apiKey = "isi_apikey"; // isi apikey lu ambil di web https://api.maelyn.tech/

    if (command === "tempnumber" || command === "temphp" || command === "tempphone") {
        try {
            let apiUrl = `https://api.maelyn.tech/api/tempnumber/generate?apikey=${apiKey}`;
            let res = await axios.get(apiUrl);
            if (!res.data || res.data.status !== "Success") throw "× Gagal mendapatkan nomor sementara!";

            let result = res.data.result;
            conn.sessionTempNumber = {
                full_number: result.full_number,
                number_pure: result.number_pure,
                createdAt: Date.now()
            };

            let replyMessage = `📲 *Temp Number Generated!*\n\n` +
                `🌍 *Negara:* ${result.country_name} (${result.country_code})\n` +
                `📆 *Dibuat:* ${result.data_humans}\n` +
                `📞 *Nomor Penuh:* ${result.full_number}\n` +
                `📟 *Nomor Tanpa +:* ${result.number_without_plus}\n` +
                `🔢 *Nomor Murni:* ${result.number_pure}\n` +
                `📦 *Arsip:* ${result.is_archive ? "✅ Ya" : "Tidak"}\n\nuntuk mengecek inboxtmpnumber ketik *.inboxnumber*`;

            m.reply(replyMessage);
        } catch (e) {
            console.error(e);
            m.reply("❌ Terjadi kesalahan saat menghasilkan nomor sementara!");
        }
    }
    
    else if (command === "inboxnumber" || command === "cektemp" || command === "checktemp") {
        if (!conn.sessionTempNumber) {
            return m.reply("× Anda belum memiliki Temp Number!\nGunakan `.tempnumber` untuk membuatnya.");
        }

        let numberPure = conn.sessionTempNumber.number_pure;
        
        try {
            let apiUrl = `https://api.maelyn.tech/api/tempnumber/inbox?apikey=${apiKey}`;
            let res = await axios.get(apiUrl);
            if (!res.data || res.data.status !== "Success") throw "× Gagal mengambil pesan masuk!";

            let messages = res.data.result.filter(msg => msg.my_number == numberPure);
            if (messages.length === 0) {
                return m.reply(`📭 *Belum ada pesan masuk di ${conn.sessionTempNumber.full_number}.*\n⏳ *Coba cek lagi nanti.*`);
            }

            let pesan = messages.map((msg) => {
                return `📬 *Pesan Baru!*\n` +
                    `💌 *Dari:* ${msg.in_number}\n` +
                    `📆 *Waktu:* ${msg.data_humans}\n` +
                    `📝 *Isi Pesan:* ${msg.text}\n` +
                    `🔢 *Kode:* ${msg.code}`;
            }).join("\n\n");

            m.reply(pesan);
        } catch (e) {
            console.error(e);
            m.reply("× Terjadi kesalahan saat mengecek inbox nomor sementara!");
        }
    }
};

handler.command = ['tmpnumber', 'temphp', 'tempphone', 'inboxnumber', 'cektempnumber', 'checktempnumber'];
handler.tags = ['tools'];
handler.help = ['tmpnumber', 'inboxnumber'];
handler.limit = 3;

module.exports = handler;