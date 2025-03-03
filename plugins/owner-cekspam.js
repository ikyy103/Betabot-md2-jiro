const msToTime = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours ? `${hours} jam ` : ''}${minutes ? `${minutes} menit ` : ''}${seconds ? `${seconds} detik` : ''}`.trim();
};

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw 'Masukkan ID grup yang ingin dicek!\n\nContoh: .cekspam 1234567890-123456@g.us';

    let groupId = args[0];
    let groupMetadata = await conn.groupMetadata(groupId).catch(() => null);

    if (!groupMetadata) throw 'Grup tidak ditemukan atau Anda tidak memiliki akses!';
    if (!groupMetadata.participants) throw 'Gagal mengambil informasi grup.';

    // Analisis aktivitas grup
    let spamCount = 0;
    let recentMessages = global.db.data.chats[groupId]?.messages || [];
    let now = Date.now();

    for (let msg of recentMessages) {
        if (msg && msg.timestamp && now - msg.timestamp < 5 * 60 * 1000) { // Pesan dalam 5 menit terakhir
            spamCount++;
        }
    }

    let spamScore = spamCount / groupMetadata.participants.length;

    let result = `📊 *Analisis Spam Grup*\n\n` +
        `Nama Grup: ${groupMetadata.subject}\n` +
        `Jumlah Anggota: ${groupMetadata.participants.length}\n` +
        `Pesan dalam 5 menit terakhir: ${spamCount}\n` +
        `Spam Score: ${(spamScore * 100).toFixed(2)}%\n\n`;

    if (spamScore > 0.5) {
        result += `⚠️ *Grup ini terdeteksi sebagai grup spam! Mohon periksa aktivitasnya.*`;
    } else {
        result += `✅ *Grup ini aman dan tidak terdeteksi sebagai grup spam.*`;
    }

    // Kirim hasil analisis
    await conn.reply(m.chat, result, m);
};

handler.help = ['cekspam <ID grup>'];
handler.tags = ['owner'];
handler.command = /^cekspam$/i;
handler.owner = true;

module.exports = handler;