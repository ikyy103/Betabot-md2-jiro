let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[1])) throw `❌ Masukkan tanggal mulai menabung dalam format YYYY-MM-DD dan jumlah uang yang ditabung per hari.\n\nContoh: ${usedPrefix}${command} 2023-01-01 10000`;

    let startDate = new Date(args[0]);
    if (isNaN(startDate)) throw `❌ Format tanggal salah. Gunakan format YYYY-MM-DD.`;

    let dailyAmount = parseInt(args[1]);
    if (dailyAmount <= 0) throw `❌ Jumlah uang per hari harus lebih dari 0.`;

    let now = new Date();
    let diff = now - startDate;

    if (diff < 0) throw `❌ Tanggal mulai tidak boleh lebih dari tanggal saat ini.`;

    let totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    let totalSavings = totalDays * dailyAmount;

    let result = `
💰 *Statistik Tabungan*:
📅 *Tanggal Mulai Menabung:* ${startDate.toLocaleDateString('id-ID')}
🗓️ *Hari Ini:* ${now.toLocaleDateString('id-ID')}
📊 *Total Hari Menabung:* ${totalDays} hari

💵 *Jumlah Ditabung Per Hari:* Rp${dailyAmount.toLocaleString('id-ID')}
💰 *Total Tabungan Hingga Hari Ini:* Rp${totalSavings.toLocaleString('id-ID')}
    `.trim();

    m.reply(result);
};

handler.help = ['nabung <YYYY-MM-DD> <jumlah>'];
handler.tags = ['tools'];
handler.command = /^(nabung|tabungan)$/i;

module.exports = handler;