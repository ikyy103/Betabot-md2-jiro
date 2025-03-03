const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]; // Data pengguna
    const hargaPremium = 5000; // Harga premium per bulan
    let now = new Date() * 1;
    let premiumDuration = 30 * 24 * 60 * 60 * 1000; // 30 hari dalam milidetik

    // Buat pembayaran QRIS
    try {
        let qrisResponse = await axios.get(`https://hafiza.apixd.my.id/api/orkut/createpayment?apikey=hafiza&amount=${hargaPremium}&codeqr=00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214501318136711360303UMI51440014ID.CO.QRIS.WWW0215ID20253689159010303UMI5204541153033605802ID5919SAT STORE OK20975566013MINAHASA TENG61059599562070703A0163048925`);
        let qrisData = qrisResponse.data;

        if (!qrisData || !qrisData.status || !qrisData.result.qrImageUrl) {
            return conn.reply(m.chat, '⚠️ Gagal membuat pembayaran QRIS. Silakan coba lagi nanti.', m);
        }

        let expirationTime = new Date(qrisData.result.expirationTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        conn.sendMessage(m.chat, {
            image: { url: qrisData.result.qrImageUrl },
            caption: `✅ *Silakan lakukan pembayaran!*

💰 Harga Premium: Rp${hargaPremium}
📌 Scan QR berikut untuk membayar.
⏳ Expired: ${expirationTime}

Tunggu proses konfirmasi pembayaran...`
        }, { quoted: m });

        let lastDate = null; // Menyimpan waktu transaksi terakhir yang dicek

        // Cek status pembayaran secara berkala
        let interval = setInterval(async () => {
            try {
                let statusResponse = await axios.get(`https://hafiza.apixd.my.id/api/orkut/cekstatus?apikey=hafiza&merchant=OK2097556`);
                let statusData = statusResponse.data;

                let transactionDate = new Date(statusData.date);
                let currentTime = new Date();
                let timeDiff = Math.abs(currentTime - transactionDate) / 1000; // Selisih dalam detik

                // Jika jam berubah dan selisih waktu kurang dari 15 detik, transaksi dianggap berhasil
                if (lastDate !== statusData.date && timeDiff <= 15) {
                    clearInterval(interval); // Hentikan pengecekan lebih lanjut
                    lastDate = statusData.date; // Update waktu transaksi terakhir
                    
                    // Perpanjang premium user
                    if (user.premium && now < user.premium_expired) {
                        user.premium_expired += premiumDuration;
                    } else {
                        user.premium = true;
                        user.premium_expired = now + premiumDuration;
                    }

                    conn.reply(m.chat, `🎉 *Pembayaran berhasil!*

✅ Anda telah menjadi pengguna *Premium*!
📆 Masa aktif: 30 hari
🕒 Berlaku hingga: ${new Date(user.premium_expired).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

📌 *Detail Transaksi:*
📅 Tanggal: ${statusData.date}
💰 Jumlah: ${statusData.amount}
🏦 Metode: ${statusData.brand_name}
🔢 Referensi: ${statusData.issuer_reff}
🛍️ Buyer Reff: ${statusData.buyer_reff}
💳 Saldo Setelah Transaksi: ${statusData.balance}
📌 Jenis QRIS: ${statusData.qris}`, m);
                }
            } catch (error) {
                console.error('Gagal mengecek status pembayaran:', error);
            }
        }, 10000); // Cek setiap 10 detik
    } catch (error) {
        console.error('Error saat membuat QRIS:', error);
        conn.reply(m.chat, '⚠️ Terjadi kesalahan dalam memproses pembayaran.', m);
    }
};

handler.help = ['buyprem'];
handler.tags = ['premium'];
handler.command = /^(buyprem|buypremium|belipremium|beliprem)$/i; // Perintah untuk membeli premium
handler.register = true; // Hanya untuk pengguna yang terdaftar

module.exports = handler;