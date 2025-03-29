const fs = require("fs");
const promoFile = "./database/promo.json";
const userPromoFile = "./database/userpromo.json";

let handler = async (m) => {
    let promo = fs.existsSync(promoFile) ? JSON.parse(fs.readFileSync(promoFile, "utf8") || "{}") : {};
    let userPromos = fs.existsSync(userPromoFile) ? JSON.parse(fs.readFileSync(userPromoFile, "utf8") || "{}") : {};

    if (!userPromos[m.sender] || userPromos[m.sender].length === 0) return m.reply("⚠️ Anda belum mengklaim promo.");

    let text = "🎟️ *Promo Anda:*\n";
    userPromos[m.sender].forEach(kode => {
        let p = promo[kode];
        if (p) {
            text += `\n💰 *Kode:* ${kode}\n📉 *Diskon:* Rp${p.diskon.toLocaleString()}\n🛒 *Minimal transaksi:* Rp${p.minTransaksi.toLocaleString()}\n📅 *Berlaku hingga:* ${new Date(p.expiryDate).toLocaleDateString()}`;
        }
    });

    m.reply(text);
};

handler.command = /^mypromos$/i;
handler.tags = ["store", "topup"];
handler.register = true;
module.exports = handler;