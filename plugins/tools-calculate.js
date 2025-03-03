let handler = async (m, { args }) => {
    if (!args[0]) throw `❌ Silakan masukkan durasi dalam jam yang ingin dihitung!\n\nContoh:\n*.calculate 2*`;

    let hours = parseFloat(args[0]); // Durasi dalam jam
    if (isNaN(hours) || hours <= 0) throw `❌ Masukkan durasi dalam angka yang valid dan lebih dari 0!`;

    // Hitung waktu
    let now = Date.now(); // Waktu saat ini dalam milidetik
    let durationMillis = hours * 3600000; // Konversi jam ke milidetik
    let targetTime = now + durationMillis;

    // Detail waktu
    let minutes = hours * 60; // Konversi ke menit
    let seconds = hours * 3600; // Konversi ke detik
    let milliseconds = durationMillis; // Langsung gunakan milidetik

    // Waktu target (format lokal)
    let targetDate = new Date(targetTime).toLocaleString('id');

    // Kirim hasil ke pengguna
    let result = `🕒 *Hasil Perhitungan Waktu*\n\n` +
                 `⏱️ *Durasi Input:* ${hours} Jam\n\n` +
                 `📌 *Detail Perhitungan:*\n` +
                 `- ${minutes} Menit\n` +
                 `- ${seconds} Detik\n` +
                 `- ${milliseconds} Milidetik\n\n` +
                 `📅 *Waktu Saat Ini:* ${new Date(now).toLocaleString('id')}\n` +
                 `🎯 *Waktu Target:* ${targetDate}`;

    m.reply(result);
};

handler.command = /^(calculate|hitungwaktu|timecalc)$/i; // CMD
handler.tags = ['tools'];
handler.help = ['calculate <jam>'];
handler.group = false; // Bisa digunakan di mana saja
handler.private = false;

module.exports = handler;