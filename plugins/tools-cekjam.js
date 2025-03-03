let handler = async (m, { args }) => {
    if (!args.length) throw `❌ Silakan masukkan durasi dalam format berikut:\n\n- Jam: 2h\n- Menit: 30m\n- Detik: 45s\n- Milidetik: 500ms\n\nAtau kombinasi:\n*.checktime 2h 30m 45s 500ms*`;

    let totalMillis = 0;

    // Proses setiap argumen
    for (let arg of args) {
        let value = parseFloat(arg.slice(0, -1)); // Nilai angka
        let unit = arg.slice(-1).toLowerCase(); // Satuan (h, m, s, ms)

        if (isNaN(value)) throw `❌ Format salah pada input "${arg}". Pastikan hanya angka diikuti satuan (h, m, s, ms).`;

        // Konversi ke milidetik
        switch (unit) {
            case 'h':
                totalMillis += value * 3600000; // Jam ke milidetik
                break;
            case 'm':
                totalMillis += value * 60000; // Menit ke milidetik
                break;
            case 's':
                totalMillis += value * 1000; // Detik ke milidetik
                break;
            case 'ms':
                totalMillis += value; // Milidetik langsung
                break;
            default:
                throw `❌ Satuan tidak valid pada input "${arg}". Gunakan h (jam), m (menit), s (detik), atau ms (milidetik).`;
        }
    }

    if (totalMillis === 0) throw `❌ Durasi tidak boleh 0. Masukkan nilai yang valid.`;

    // Hitung waktu target
    let now = Date.now();
    let targetTime = new Date(now + totalMillis);

    // Format output
    let result = `🕒 *Cek Jam*\n\n` +
                 `📅 *Waktu Saat Ini:* ${new Date(now).toLocaleString('id')}\n` +
                 `⏱️ *Durasi Total:* ${Math.floor(totalMillis / 3600000)} Jam, ` +
                 `${Math.floor((totalMillis % 3600000) / 60000)} Menit, ` +
                 `${Math.floor((totalMillis % 60000) / 1000)} Detik, ` +
                 `${totalMillis % 1000} Milidetik\n` +
                 `🎯 *Waktu Target:* ${targetTime.toLocaleString('id')}`;

    m.reply(result);
};

handler.command = /^(checktime|cekjam)$/i; // CMD
handler.tags = ['tools'];
handler.help = ['checktime <durasi>'];
handler.group = false; // Bisa digunakan di mana saja
handler.private = false;

module.exports = handler;