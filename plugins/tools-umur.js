let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `❌ Masukkan tanggal lahir dalam format YYYY-MM-DD.\n\nContoh: ${usedPrefix}${command} 2000-01-01`;

    let birthDate = new Date(args[0]);
    if (isNaN(birthDate)) throw `❌ Format tanggal salah. Gunakan format YYYY-MM-DD.`;

    let now = new Date();
    let diff = now - birthDate;

    if (diff < 0) throw `❌ Tanggal lahir tidak boleh lebih dari tanggal saat ini.`;

    let totalSeconds = Math.floor(diff / 1000);
    let totalMinutes = Math.floor(totalSeconds / 60);
    let totalHours = Math.floor(totalMinutes / 60);
    let totalDays = Math.floor(totalHours / 24);
    let totalWeeks = Math.floor(totalDays / 7);
    let totalMonths = Math.floor(totalDays / 30.44); // Approximate months
    let totalYears = Math.floor(totalDays / 365.25); // Approximate years

    let totalNights = totalDays; // 1 malam per hari
    let totalMornings = totalDays; // 1 pagi per hari

    let totalPrayers = totalDays * 5; // 5 kali sholat sehari

    let result = `
📅 *Waktu dari Lahir Hingga Sekarang*:
🗓️ *Tanggal Lahir:* ${birthDate.toLocaleDateString('id-ID')}
🕒 *Sekarang:* ${now.toLocaleDateString('id-ID')}

📊 *Statistik Waktu*:
- 🗓️ *Total Tahun:* ${totalYears} tahun
- 📆 *Total Bulan:* ${totalMonths} bulan
- 🗓️ *Total Minggu:* ${totalWeeks} minggu
- 🗓️ *Total Hari:* ${totalDays} hari
- 🕒 *Total Jam:* ${totalHours} jam
- ⏱️ *Total Menit:* ${totalMinutes} menit
- ⏲️ *Total Detik:* ${totalSeconds} detik

🌙 *Total Malam yang Dilewati:* ${totalNights} malam
🌞 *Total Pagi yang Dilewati:* ${totalMornings} pagi
🕌 *Total Ibadah Sholat (5x Sehari):* ${totalPrayers} kali
    `.trim();

    m.reply(result);
};

handler.help = ['umur <YYYY-MM-DD>'];
handler.tags = ['tools'];
handler.command = /^(umur|age|timepassed)$/i;

module.exports = handler;