const paymentConfig = {
    prices: {
            3: 5000,      // 3 Hari
        7: 10000,      // 1 Minggu
        14: 12000,    // 2 Minggu
        21: 14000,    // 3 Minggu
        30: 15000,    // 1 Bulan
        60: 30000,    // 2 Bulan
        90: 60000,    // 3 Bulan
        365: 120000,   // 1 Tahun
    },
    email: 'satriamahadmadanir@gmail.com',
    userID: 'Jirodonate',
    name: 'Jirodonate',

};

const checkSaweriaPayment = async (userID, nominal, conn, m, user) => {
    let isChecking = false;
    let maxChecks = 5;
    let attempts = 0;

    const interval = setInterval(async () => {
        if (attempts >= maxChecks) {
            clearInterval(interval);
            if (user.payment) delete user.payment;
            conn.reply(m.chat, '❌ Verifikasi pembayaran gagal. Silakan coba lagi nanti.', m);
            return;
        }

        attempts++;
        if (isChecking) return; // Hindari overlap permintaan
        isChecking = true;

        try {
            console.log(`🔍 Verifikasi pembayaran (${attempts}/${maxChecks}) untuk refID: ${user.payment?.refID}`);

            const response = await fetch(`https://itzpire.com/saweria/check-payment?id=${user.payment?.refID}&user_id=${userID}`);
            if (!response.ok) {
                throw new Error('Gagal menerima respons dari server.');
            }

            const checkJson = await response.json();
            console.log(`📄 Respons API:`, checkJson);

            if (checkJson.msg === "OA4XSN" || (checkJson.status === "success" && checkJson.data?.status === "success")) {
                clearInterval(interval);

                const duration = getPremiumDurationFromNominal(nominal);
                if (!duration) {
                    conn.reply(m.chat, '❌ Nominal tidak valid untuk aktivasi premium.', m);
                    return;
                }

                const now = Date.now();
                user.premium = true;
                user.premiumTime = user.premiumTime && user.premiumTime > now 
                    ? user.premiumTime + duration 
                    : now + duration;
                delete user.payment;

                const successMessage = `✅ *Pembayaran Berhasil!*\n\n💰 *Nominal:* Rp${nominal}\n⏳ *Premium Aktif Selama:* ${duration / 86400000} Hari`;
                await conn.sendMessage(m.chat, { text: successMessage }, { quoted: m });
                return;
            }

            if (checkJson.data?.status === "failed") {
                clearInterval(interval);
                delete user.payment;
                conn.reply(m.chat, '❌ Pembayaran gagal. Silakan coba lagi.', m);
            } else {
                console.log(`Status pembayaran: ${checkJson.data?.status || 'pending'}. Proses berlanjut...`);
            }
        } catch (error) {
            console.error(`❌ Kesalahan Verifikasi Pembayaran:`, error.message);
            conn.reply(m.chat, `❌ Kesalahan saat memverifikasi pembayaran: ${error.message}`, m);
        } finally {
            isChecking = false;
        }
    }, 20000); // Interval pengecekan setiap 20 detik
};

// Pastikan fungsi handler juga menangani kesalahan dengan baik
const handler = async (m, { conn, text }) => {
    const jumlahHari = parseInt(text);

    if (!jumlahHari || isNaN(jumlahHari) || jumlahHari < 3) {
        return conn.reply(m.chat, '*📋 Daftar Harga Premium*\n\n' +
            Object.entries(paymentConfig.prices).map(([days, price]) => `• ${days} Hari: Rp${price}`).join('\n') +
            '\n\nKetik *.buyprem <jumlah hari>* untuk membeli premium. Contoh: *.buyprem 90*', m);
    }

    const nominal = paymentConfig.prices[jumlahHari];
    if (!nominal) {
        return conn.reply(m.chat, '❌ Jumlah hari tidak valid. Silakan pilih dari daftar harga yang tersedia.', m);
    }

    const { email, userID, name } = paymentConfig;
    const message = `Pembayaran sebesar Rp${nominal}`;

    await conn.reply(m.chat, `⏳ Anda akan melakukan pembelian premium sebesar Rp${nominal} untuk ${jumlahHari} hari. Silakan lakukan pembayaran melalui QR code yang muncul nanti.`, m);

    try {
        const response = await fetch(`https://itzpire.com/saweria/create-payment?amount=${nominal}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&user_id=${userID}&msg=${encodeURIComponent(message)}`);
        if (!response.ok) {
            throw new Error('Gagal membuat pembayaran. Silakan coba lagi.');
        }

        const paymentJson = await response.json();

        if (paymentJson.status === "success" && paymentJson.data) {
            const { qr_image: qrImage, url: paymentUrl } = paymentJson.data;

            let user = global.db.data.users[m.sender];
            if (!user) user = global.db.data.users[m.sender] = { saldo: 0 };

            user.payment = {
                refID: paymentJson.data.id,
                amount: nominal,
                status: 'pending',
                qrImage,
                paymentUrl
            };

            await conn.sendMessage(m.chat, {
                image: { url: qrImage },
                caption: `🎉 *Pembelian Premium*\n\n💰 *Total Pembayaran:* Rp${nominal}\n⏳ *Durasi Premium:* ${jumlahHari} Hari\n\n📌 *Langkah Pembayaran:*\n1. Scan QR code di bawah ini menggunakan aplikasi pembayaran.\n2. Pastikan nominal pembayaran sesuai (Rp${nominal}).\n3. Tunggu proses verifikasi (maksimal 5 menit).\n\n🌐 *Link Pembayaran:*\n[Klik untuk Membayar](${paymentUrl})\n\n> © Zephyr-CODER`,
            }, { quoted: m });

            checkSaweriaPayment(userID, nominal, conn, m, user);
        } else {
            throw new Error(paymentJson.error_msg || 'Terjadi kesalahan yang tidak diketahui.');
        }
    } catch (error) {
        console.error("Kesalahan API:", error);
        conn.reply(m.chat, `Terjadi kesalahan saat membuat QR code pembayaran. ${error.message}`, m);
    }
};

handler.help = ['buyprem <jumlah hari>'];
handler.tags = ['info'];
handler.command = /^(buyprem)$/i;

module.exports = handler;