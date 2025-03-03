const moment = require("moment-timezone");

async function before(m) {
    this.autoRamadhan = this.autoRamadhan || {};

    const chatIds = [
        "120363347063028657@g.us",
        "120363335094526176@g.us"
    ];

    const ramadhanDate = moment.tz("2025-03-01 00:00", "Asia/Jakarta");
    const idulFitriDate = moment.tz("2025-03-31 00:00", "Asia/Jakarta");

    // 🔹 Ambil waktu sekarang
    const now = moment().tz("Asia/Jakarta");
    const timeNow = now.format("HH:mm");

    let daysToRamadhan = ramadhanDate.diff(now, "days");
    let daysToIdulFitri = idulFitriDate.diff(now, "days");

    console.log(`[DEBUG] Waktu Sekarang: ${timeNow}, Hari ke Ramadan: ${daysToRamadhan}, Hari ke Idul Fitri: ${daysToIdulFitri}`);

    for (let id of chatIds) {
        if (!this.autoRamadhan[id]) {
            this.autoRamadhan[id] = {
                countdownSent: false,
                puasaNotifSent: false,
                idulFitriCountdownSent: false,
                idulFitriNotifSent: false
            };
        }

        if (daysToRamadhan > 0 && timeNow === "00:00" && !this.autoRamadhan[id].countdownSent) {
            console.log(`[DEBUG] Mengirim hitung mundur Ramadan ke ${id}`);
            await this.reply(id, `📢 *Hitung Mundur Ramadan 2025* 📢\nTersisa *${daysToRamadhan} hari lagi* menuju bulan suci Ramadan. Persiapkan diri Anda untuk ibadah yang lebih baik!`);
            this.autoRamadhan[id].countdownSent = true;
        }

        if (daysToRamadhan === 0 && timeNow === "00:00" && !this.autoRamadhan[id].puasaNotifSent) {
            console.log(`[DEBUG] Mengirim notif puasa ke ${id}`);
            await this.reply(id, `🌙 *Ramadan Telah Tiba!* 🌙\nHai, puasa telah tiba! Saatnya Anda menjalankan ibadah puasa. Semoga puasa Anda penuh berkah dan diterima oleh Allah SWT.`);
            this.autoRamadhan[id].puasaNotifSent = true;
            this.autoRamadhan[id].countdownSent = false; // Reset countdown untuk Idul Fitri
        }

        if (daysToRamadhan <= 0 && daysToIdulFitri > 0 && timeNow === "00:00" && !this.autoRamadhan[id].idulFitriCountdownSent) {
            console.log(`[DEBUG] Mengirim hitung mundur Idul Fitri ke ${id}`);
            await this.reply(id, `🕌 *Hitung Mundur Idul Fitri 2025* 🕌\nTersisa *${daysToIdulFitri} hari lagi* menuju Hari Raya Idul Fitri. Tetap istiqamah dalam ibadah!`);
            this.autoRamadhan[id].idulFitriCountdownSent = true;
        }

        // 🔹 Notifikasi Idul Fitri (1 Syawal / 30 Maret)
        if (daysToIdulFitri === 0 && timeNow === "00:00" && !this.autoRamadhan[id].idulFitriNotifSent) {
            console.log(`[DEBUG] Mengirim notif Idul Fitri ke ${id}`);
            await this.reply(id, `✨ *Selamat Hari Raya Idul Fitri 1446H* ✨\nTaqabbalallahu minna wa minkum, minal aidin wal faizin. Mohon maaf lahir dan batin! 🕌🤲`);
            this.autoRamadhan[id].idulFitriNotifSent = true;
        }

        // 🔹 Reset status setiap hari pukul 00:00
        if (timeNow === "00:00") {
            console.log(`[DEBUG] Reset status harian untuk ${id}`);
            this.autoRamadhan[id].countdownSent = false;
            this.autoRamadhan[id].idulFitriCountdownSent = false;
        }
    }
}

async function testSendMessage() {
    const testId = "120363347063028657@g.us"; // Ganti ID chat untuk pengujian
    console.log(`[DEBUG] Mengirim pesan tes ke ${testId}`);
    await this.reply(testId, "✅");
}

// Memanggil fungsi startup
testSendMessage();

module.exports = {
    before,
    testSendMessage,
    disabled: false
};