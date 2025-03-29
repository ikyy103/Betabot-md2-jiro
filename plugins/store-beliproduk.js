const fs = require("fs");
const axios = require("axios");

const promoFile = "./database/promo.json";
const userPromoFile = "./database/userpromo.json";

const MEMBER_ID = "${global.idorkut}";
const PIN = "${global.pinorkut}";
const PASSWORD = "${global.pworkut}";

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 2) {
        return conn.reply(m.chat, `📌 *Gunakan format:*\n${usedPrefix + command} <kode_produk> <nomor_tujuan>\n\nContoh:\n${usedPrefix + command} T1 081234567890`, m);
    }

    let [kodeProduk, nomorTujuan] = args;

    const apiUrl = "https://okeconnect.com/harga/json?id=905ccd028329b0a";
    let response;
    
    try {
        response = await axios.get(apiUrl);
    } catch (error) {
        return conn.reply(m.chat, " Gagal mengambil daftar produk. Silakan coba lagi nanti.", m);
    }

    let products = response.data;
    let selectedProduct = products.find(p => p.kode.toLowerCase() === kodeProduk.toLowerCase());

    if (!selectedProduct) {
        return conn.reply(m.chat, ` Kode produk *${kodeProduk}* tidak ditemukan. Gunakan perintah *.produk* untuk melihat daftar produk.`, m);
    }

    let hargaProduk = parseInt(selectedProduct.harga);
    let keuntungan = 100; // set aja bebas mau ambil keuntung
    let totalHarga = hargaProduk + keuntungan;

    // Cek saldo user
    let user = global.db.data.users[m.sender];
    let saldoUser = user.dana || 0;

    // *Cek Promo yang Tersedia*
    let userPromos = JSON.parse(fs.readFileSync(userPromoFile, "utf8"));
    let promo = JSON.parse(fs.readFileSync(promoFile, "utf8"));
    
    let diskon = 0;
    let promoTerpakai = null;

    if (userPromos[m.sender]) {
        for (let kode of userPromos[m.sender]) {
            let p = promo[kode];
            if (p && hargaProduk >= p.minTransaksi) {
                if (p.diskon > diskon) {
                    diskon = p.diskon;
                    promoTerpakai = kode;
                }
            }
        }
    }

    // Terapkan diskon promo
    if (promoTerpakai) {
        totalHarga -= diskon;
        // Hapus promo setelah digunakan
        userPromos[m.sender] = userPromos[m.sender].filter(kode => kode !== promoTerpakai);
        fs.writeFileSync(userPromoFile, JSON.stringify(userPromos, null, 2));
    }

    if (saldoUser < totalHarga) {
        let kekurangan = totalHarga - saldoUser;
        return conn.reply(m.chat, ` Saldo tidak mencukupi! Anda perlu deposit *Rp${kekurangan.toLocaleString()}* lagi.\n\nGunakan perintah *.deposit* untuk isi saldo.`, m);
    }

    let refID = `TRX${Date.now()}`;

    let transactionUrl = `https://h2h.okeconnect.com/trx?product=${kodeProduk}&dest=${nomorTujuan}&refID=${refID}&memberID=${MEMBER_ID}&pin=${PIN}&password=${PASSWORD}`;

    let transactionResponse;
    try {
        transactionResponse = await axios.get(transactionUrl);
    } catch (error) {
        return conn.reply(m.chat, " Gagal melakukan transaksi. Silakan coba lagi nanti.", m);
    }

    let result = transactionResponse.data;
    if (result.status !== "sukses") {
        return conn.reply(m.chat, ` Transaksi gagal: ${result.pesan}`, m);
    }

    let transaksiId = result.id_transaksi;

    user.dana -= totalHarga;
    user.totalTransaksi = (user.totalTransaksi || 0) + totalHarga;

    conn.reply(m.chat, `✅ *Transaksi Berhasil!*\n\n📌 *Detail:*\n- ID Transaksi: ${transaksiId}\n- Nomor Tujuan: ${nomorTujuan}\n- Produk: ${selectedProduct.produk}\n- Harga Awal: Rp${(hargaProduk + keuntungan).toLocaleString()}\n- Diskon Promo: Rp${diskon.toLocaleString()}\n- Total Bayar: Rp${totalHarga.toLocaleString()}\n\nTerima kasih telah menggunakan layanan kami!`, m);
};

handler.help = ["beliproduk"];
handler.tags = ["store","topup"];
handler.command = /^(beliproduk)$/i;
handler.register = true;

module.exports = handler;