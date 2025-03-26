let fetch = require('node-fetch');

let handler = async (m, { args, usedPrefix, command }) => {
    let [type, jumlah] = args;
    let validTypes = ["MasterCard", "Visa", "Amex", "Discover"];

    if (!type || !validTypes.includes(type)) {
        throw `⚠️ Format salah! Pilih tipe: MasterCard, Visa, Amex, Discover.\n\n🔰 *Cara penggunaan:*\nKetik: *${usedPrefix}${command} <type> <jumlah>*\nContoh: *${usedPrefix}${command} Visa 3*`;
    }

    jumlah = jumlah && !isNaN(jumlah) ? parseInt(jumlah) : 1;
    if (jumlah < 1 || jumlah > 10) throw "⚠️ Jumlah VCC minimal 1 dan maksimal 10!";

    try {
        let response = await fetch(`https://api.siputzx.my.id/api/tools/vcc-generator?type=${type}&count=${jumlah}`);
        let data = await response.json();

        if (!data.status || !data.data || !Array.isArray(data.data)) throw "⚠️ Gagal mengambil data VCC.";

        let message = `💳 *Virtual Credit Card (VCC) - ${type}*\n\n`;
        for (let i = 0; i < data.data.length; i++) {
            let card = data.data[i];
            message += `*Card ${i + 1}*\n`;
            message += `• 🏷️ Name: ${card.cardholderName || "N/A"}\n`;
            message += `• 💳 Number: ${card.cardNumber || "N/A"}\n`;
            message += `• 📆 Exp: ${card.expirationDate || "N/A"}\n`;
            message += `• 🔐 CVV: ${card.cvv || "N/A"}\n\n`;
        }

        m.reply(message.trim());
    } catch (err) {
        console.error(err);
        throw "⚠️ Terjadi kesalahan saat mengambil VCC.";
    }
};

handler.help = ['vcc <type> <jumlah>'];
handler.tags = ['tools'];
handler.command = /^(vcc|cvcc)$/i;
handler.limit = true;

module.exports = handler;