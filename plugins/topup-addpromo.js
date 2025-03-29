const fs = require("fs");
const promoFile = "./database/promo.json";

let handler = async (m, { args }) => {
    if (args.length < 4) return m.reply("⚠️ Format: .addpromo <kode> <diskon> <durasi_hari> <min_transaksi>");

    let [kode, diskon, durasi, minTransaksi] = args;
    diskon = parseInt(diskon);
    durasi = parseInt(durasi);
    minTransaksi = parseInt(minTransaksi);

    if (isNaN(diskon) || isNaN(durasi) || isNaN(minTransaksi)) {
        return m.reply("⚠️ Diskon, durasi, dan minimal transaksi harus angka.");
    }

    let promo = {};

    // Cek apakah file promo.json ada dan valid
    if (fs.existsSync(promoFile)) {
        try {
            const data = fs.readFileSync(promoFile, "utf8").trim();
            if (data) {
                promo = JSON.parse(data);
                if (typeof promo !== "object") throw new Error("Invalid JSON format");
            } else {
                promo = {}; // Jika file kosong, inisialisasi objek kosong
            }
        } catch (error) {
            console.error("Error reading promo file:", error); // Debugging
            return m.reply("⚠️ Terjadi kesalahan dalam membaca file promo. File JSON mungkin rusak.");
        }
    } else {
        console.log("Promo file does not exist, creating a new one."); // Debugging
    }

    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durasi);

    promo[kode.toUpperCase()] = { diskon, expiryDate: expiryDate.toISOString(), minTransaksi };

    try {
        fs.writeFileSync(promoFile, JSON.stringify(promo, null, 2));
        m.reply(`✅ Promo *${kode.toUpperCase()}* berhasil ditambahkan!`);
    } catch (error) {
        console.error("Error saving promo file:", error); // Debugging
        return m.reply("⚠️ Terjadi kesalahan saat menyimpan promo. Silakan coba lagi.");
    }
};

handler.command = /^addpromo$/i;
handler.tags = ["store", "topup"];
handler.owner = true;

module.exports = handler;