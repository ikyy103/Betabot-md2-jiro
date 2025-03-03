let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Cek apakah bot adalah admin di grup
    if (!m.isGroup) throw '❌ Perintah ini hanya dapat digunakan di dalam grup!';
    let groupMetadata = await conn.groupMetadata(m.chat);
    let botAdmin = groupMetadata.participants.find((p) => p.id === conn.user.jid && p.admin);
    if (!botAdmin) throw '❌ Bot harus menjadi admin untuk menggunakan perintah ini!';

    // Cek apakah ada nomor yang diberikan
    if (args.length === 0) throw `🚩 Gunakan format:\n${usedPrefix}${command} <nomor1> <nomor2> ...\n\nContoh:\n${usedPrefix}${command} 6281234567890 6289876543210`;

    // Batasi maksimum 10 nomor
    if (args.length > 10) throw '❌ Anda hanya dapat mengundang maksimal 10 nomor dalam satu perintah.';

    // Validasi semua nomor
    let invalidNumbers = args.filter(num => !/^\d+$/.test(num));
    if (invalidNumbers.length > 0) throw `❌ Nomor berikut tidak valid: ${invalidNumbers.join(', ')}`;

    // Tambahkan @s.whatsapp.net ke setiap nomor
    let targets = args.map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    // Dapatkan tautan undangan grup
    let inviteCode = await conn.groupInviteCode(m.chat);
    let groupName = groupMetadata.subject;
    let inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

    let successCount = 0;
    let failedCount = 0;

    // Kirim undangan ke setiap nomor
    for (let targetJid of targets) {
        try {
            await conn.sendMessage(targetJid, {
                text: `Halo! 👋\n\nAnda diundang untuk bergabung ke grup *${groupName}*.\nKlik tautan berikut untuk bergabung:\n\n${inviteLink}\n\nKami menantikan kehadiran Anda!`,
            });
            successCount++;
        } catch (e) {
            failedCount++;
        }
    }

    // Respon akhir ke grup
    let report = `✅ *Laporan Undangan* ✅\n\n`;
    report += `🔹 Berhasil dikirim: ${successCount} undangan\n`;
    report += `🔹 Gagal dikirim: ${failedCount} undangan\n\n`;
    report += `📌 Pastikan nomor yang diberikan aktif di WhatsApp.\n\nTerima kasih!`;

    m.reply(report);
};

handler.help = ['invites <nomor1> <nomor2> ...'];
handler.tags = ['group'];
handler.command = /^(invites|undangbeberapa)$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;