const axios = require('axios'); const { proto } = require('@adiwajshing/baileys').default;

function msToDate(ms) { let days = Math.floor(ms / (24 * 60 * 60 * 1000)); let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)); let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000)); return ${days} hari ${hours} jam ${minutes} menit; }

let handler = async (m, { conn, args, command, usedPrefix }) => { let who = args[0] || (m.isGroup ? m.chat : null); const hargaSewa = 5000; // Harga per bulan (30 hari)

if (!who) throw `Gunakan format: ${usedPrefix + command} <link grup> <jumlah bulan>`;
let jumlahBulan = args[1] ? parseInt(args[1]) : 1;
if (isNaN(jumlahBulan) || jumlahBulan < 1) throw 'Masukkan jumlah bulan yang valid!';

let totalHarga = jumlahBulan * hargaSewa;

try {
    // Buat QRIS untuk pembayaran
    let qrisResponse = await axios.get(`https://hafiza.apixd.my.id/api/orkut/createpayment?apikey=hafiza&amount=${totalHarga}&codeqr=00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214501318136711360303UMI51440014ID.CO.QRIS.WWW0215ID20253689159010303UMI5204541153033605802ID5919SAT STORE OK20975566013MINAHASA TENG61059599562070703A0163048925`);
    let qrisData = qrisResponse.data;

    if (!qrisData || !qrisData.status || !qrisData.result.qrImageUrl) {
        throw '⚠️ Gagal membuat pembayaran QRIS. Coba lagi nanti.';
    }

    let expirationTime = new Date(qrisData.result.expirationTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    conn.sendMessage(m.chat, {
        image: { url: qrisData.result.qrImageUrl },
        caption: `✅ *Silakan lakukan pembayaran!*

💰 Jumlah: Rp${totalHarga} 📌 Scan QR berikut untuk membayar. ⏳ Expired: ${expirationTime}` }, { quoted: m });

// Cek status pembayaran secara berkala
    let interval = setInterval(async () => {
        try {
            let statusResponse = await axios.get(`https://hafiza.apixd.my.id/api/orkut/cekstatus?apikey=hafiza&merchant=OK2097556`);
            let statusData = statusResponse.data;

            if (statusData.status === 'PAID') {
                clearInterval(interval);
                let now = new Date() * 1;
                let jumlahHari = 86400000 * 30 * jumlahBulan;

                if (!global.db.data.chats[who]) global.db.data.chats[who] = {};
                if (global.db.data.chats[who].expired && now < global.db.data.chats[who].expired) {
                    global.db.data.chats[who].expired += jumlahHari;
                } else {
                    global.db.data.chats[who].expired = now + jumlahHari;
                }
                conn.reply(m.chat, `🎉 *Pembayaran berhasil!*

✅ Grup berhasil disewa selama ${jumlahBulan} bulan. ⏳ Masa aktif: ${msToDate(global.db.data.chats[who].expired - now)}`); } } catch (error) { console.error('Gagal mengecek status pembayaran:', error); } }, 10000); } catch (error) { console.error('Error saat membuat QRIS:', error); conn.reply(m.chat, '⚠️ Terjadi kesalahan dalam memproses pembayaran.', m); } };

handler.command = ['sewa']; handler.help = ['sewa <link grup> <jumlah bulan>']; handler.tags = ['main']; handler.rowner = false;

module.exports = handler;