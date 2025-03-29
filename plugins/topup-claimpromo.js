const fs = require("fs");
const promoFile = "./database/promo.json";
const userPromoFile = "./database/userpromo.json";

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply("⚠️ Format: .claimpromo <kode>");

    let kode = args[0].toUpperCase();

    // Pastikan file ada dan valid
    let promo = fs.existsSync(promoFile) ? JSON.parse(fs.readFileSync(promoFile, "utf8") || "{}") : {};
    let userPromos = fs.existsSync(userPromoFile) ? JSON.parse(fs.readFileSync(userPromoFile, "utf8") || "{}") : {};

    if (!promo[kode]) return m.reply("⚠️ Promo tidak ditemukan.");

    if (!userPromos[m.sender]) userPromos[m.sender] = [];
    if (userPromos[m.sender].includes(kode)) return m.reply("⚠️ Anda sudah mengklaim promo ini.");

    userPromos[m.sender].push(kode);
    fs.writeFileSync(userPromoFile, JSON.stringify(userPromos, null, 2));

    m.reply(`✅ Promo *${kode}* berhasil diklaim!`);
};

handler.command = /^claimpromo$/i;
handler.tags = ["store", "topup"];
handler.register = true;

module.exports = handler;