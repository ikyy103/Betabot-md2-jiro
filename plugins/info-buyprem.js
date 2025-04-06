const axios = require('axios');

const paymentConfig = {
    prices: {
        3: 5000,
        7: 10000,
        14: 12000,
        21: 14000,
        30: 15000,
        60: 30000,
        90: 60000,
        365: 120000,
    },
    qrisCode: '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214501318136711360303UMI51440014ID.CO.QRIS.WWW0215ID20253689159010303UMI5204541153033605802ID5919SAT STORE OK20975566013MINAHASA TENG61059599562070703A0163048925',
    apikey: 'hafiza',
    merchant: 'OK2097556',
    keyorkut: '907537717367414962097556OKCT4DFD1CB58971AF6FF0D2FCC6F1DF2CCD',
};

const handler = async (m, { conn, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    const days = args[0] ? parseInt(args[0]) : 0;

    if (!days || isNaN(days) || days < 3) {
        return conn.reply(m.chat, '*📋 Daftar Harga Premium*\n' + Object.entries(paymentConfig.prices).map(([d, p]) => `• ${d} Hari: Rp${p}`).join('\n') + `\n\nKetik *${usedPrefix}buyprem <jumlah hari>* untuk membeli premium. Contoh: *${usedPrefix}buyprem 30*`, m);
    }

    const amount = paymentConfig.prices[days];
    if (!amount) {
        return conn.reply(m.chat, '❌ Jumlah hari tidak valid. Silakan pilih dari daftar harga yang tersedia.', m);
    }

    if (user.dana >= amount) {
        user.dana -= amount;
        const now = Date.now();
        const duration = days * 86400000;
        user.premium = true;
        user.premiumTime = user.premiumTime && user.premiumTime > now ? user.premiumTime + duration : now + duration;

        return conn.reply(m.chat, `✅ *Pembelian Premium Berhasil!*\n⏳ Durasi: ${days} Hari 💰 Harga: Rp${amount} 🏦 Metode: Saldo Internal`, m);
    }

    try {
        const { qrisCode, apikey } = paymentConfig;
        const response = await axios.get(`https://hafiza.apixd.my.id/api/orkut/createpayment?apikey=${apikey}&amount=${amount}&codeqr=${encodeURIComponent(qrisCode)}`);
        const qrisData = response.data;

        if (!qrisData || !qrisData.status || !qrisData.result.qrImageUrl) {
            return conn.reply(m.chat, '⚠️ Gagal membuat pembayaran QRIS. Silakan coba lagi nanti.', m);
        }

        const expirationTime = new Date(qrisData.result.expirationTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        await conn.sendMessage(m.chat, {
            image: { url: qrisData.result.qrImageUrl },
            caption: `✅ *Silakan lakukan pembayaran!*\n💰 Jumlah: Rp${amount} ⏳ Durasi Premium: ${days} Hari 📌 Scan QR berikut untuk membayar. ⏳ Expired: ${expirationTime}\n\nTunggu proses konfirmasi pembayaran otomatis...`
        }, { quoted: m });

        let lastDate = null;
        const interval = setInterval(async () => {
            try {
                const statusResponse = await axios.get(`https://hafiza.apixd.my.id/api/orkut/cekstatus?apikey=${apikey}&merchant=${paymentConfig.merchant}&keyorkut=${paymentConfig.keyorkut}`);
                const statusData = statusResponse.data;

                const transactionDate = new Date(statusData.date);
                const currentTime = new Date();
                const timeDiff = Math.abs(currentTime - transactionDate) / 1000;

                if (lastDate !== statusData.date && timeDiff <= 15) {
                    clearInterval(interval);
                    lastDate = statusData.date;

                    const now = Date.now();
                    const duration = days * 86400000;
                    user.premium = true;
                    user.premiumTime = user.premiumTime && user.premiumTime > now ? user.premiumTime + duration : now + duration;

                    conn.reply(m.chat, `✅ *Pembayaran berhasil!*\n⏳ Durasi Premium: ${days} Hari 💰 Jumlah: Rp${amount} 🏦 Metode: ${statusData.brand_name} 🔢 Referensi: ${statusData.issuer_reff}\n\nTerima kasih telah mendukung bot ini!`, m);
                }
            } catch (error) {
                console.error('Gagal mengecek status pembayaran:', error);
            }
        }, 10000);
    } catch (error) {
        console.error('Error saat membuat QRIS:', error);
        conn.reply(m.chat, '⚠️ Terjadi kesalahan dalam memproses pembayaran.', m);
    }
};

handler.help = ['buyprem <jumlah hari>'];
handler.tags = ['info'];
handler.command = /^(buyprem)$/i;
handler.register = true;

module.exports = handler;