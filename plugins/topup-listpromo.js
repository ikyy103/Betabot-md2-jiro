const fs = require("fs");
const promoFile = "./database/promo.json";

let handler = async (m) => {
    let promo = fs.existsSync(promoFile) ? JSON.parse(fs.readFileSync(promoFile, "utf8") || "{}") : {};

    if (Object.keys(promo).length === 0) return m.reply("⚠️ Tidak ada promo tersedia.");

    let text = "📌 *Daftar Promo:*\n";
    for (let kode in promo) {
        let p = promo[kode];
        text += `\n💰 *Kode:* ${kode}\n📉 *Diskon:* Rp${p.diskon.toLocaleString()}\n📅 *Berlaku hingga:* ${new Date(p.expiryDate).toLocaleDateString()}\n🛒 *Minimal transaksi:* Rp${p.minTransaksi.toLocaleString()}\n`;
    }

    m.reply(text);
};

handler.command = /^listpromo$/i;
handler.tags = ["store", "topup"];
handler.register = true;
module.exports = handler;