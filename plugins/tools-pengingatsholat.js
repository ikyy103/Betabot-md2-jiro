const fetch = require('node-fetch'); // Untuk mendapatkan data dari API
const schedule = require('node-schedule'); // Untuk mengatur jadwal pengingat

let handler = async (m, { conn }) => {
    const groupId = '120363347063028657@g.us'; // ID grup tertentu
    const timezone = 'Asia/Jakarta'; // Zona waktu default (ubah sesuai kebutuhan)

    try {
        // Ambil data jadwal salat dari API
        const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2&school=1`;
        const response = await fetch(apiUrl);
        const { data } = await response.json();

        if (!data) throw 'Gagal mengambil jadwal salat.';

        const times = {
            Subuh: data.timings.Fajr,
            Dzuhur: data.timings.Dhuhr,
            Ashar: data.timings.Asr,
            Maghrib: data.timings.Maghrib,
            Isya: data.timings.Isha
        };

        // Loop untuk membuat pengingat pada setiap waktu salat
        Object.entries(times).forEach(([sholat, time]) => {
            const [hour, minute] = time.split(':').map(Number);

            // Jadwalkan pengingat
            schedule.scheduleJob({ hour, minute, tz: timezone }, async () => {
                try {
                    await conn.sendMessage(
                        groupId,
                        `🕌 *Pengingat Waktu Salat*\n\nSudah masuk waktu salat *${sholat}*.\nAyo segera tunaikan salat!`,
                        { mentions: [] }
                    );
                } catch (e) {
                    console.error(`Gagal mengirim pengingat salat untuk ${sholat}:`, e);
                }
            });
        });

        m.reply(`✅ *Pengingat Salat untuk Grup*\n\n📍 Lokasi: Jakarta\n📅 Tanggal: ${data.date.readable}\n\nJadwal Salat:\n` +
            `- Subuh: ${times.Subuh}\n` +
            `- Dzuhur: ${times.Dzuhur}\n` +
            `- Ashar: ${times.Ashar}\n` +
            `- Maghrib: ${times.Maghrib}\n` +
            `- Isya: ${times.Isya}\n\nPengingat akan otomatis dikirim ke grup.`);
    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal mengatur pengingat salat. Pastikan API aktif dan terhubung ke internet.');
    }
};

handler.command = /^(pengingatsholat|sholatgroup)$/i;
handler.tags = ['tools'];
handler.help = ['pengingatsholat'];
handler.group = false;
handler.private = false;

module.exports = handler;