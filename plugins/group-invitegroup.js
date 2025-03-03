let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Cek apakah bot adalah admin di grup
    if (!m.isGroup) throw 'Perintah ini hanya dapat digunakan di dalam grup!';
    let groupMetadata = await conn.groupMetadata(m.chat);
    let botAdmin = groupMetadata.participants.find((p) => p.id === conn.user.jid && p.admin);
    if (!botAdmin) throw 'Bot harus menjadi admin untuk menggunakan perintah ini!';

    // Validasi ID grup target
    let targetGroupId = args[0];
    if (!targetGroupId) throw `🚩 Gunakan format:\n${usedPrefix}${command} <id_grup>\n\nContoh: ${usedPrefix}${command} 123456789-123456@g.us`;

    try {
        // Peroleh kode undangan grup target
        let inviteCode = await conn.groupInviteCode(targetGroupId);
        let inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Persiapkan pesan hidetag
        let message = `
🔗 *Tautan Undangan Grup Baru* 🔗

Grup baru tersedia untuk Anda bergabung!
Klik tautan berikut untuk bergabung:

${inviteLink}

Kami menantikan kehadiran Anda!
        `.trim();

        // Kirim pesan dengan hidetag
        await conn.sendMessage(m.chat, { text: message, mentions: groupMetadata.participants.map(p => p.id) });

        m.reply(`✅ Undangan grup berhasil dikirim ke semua anggota!`);
    } catch (e) {
        m.reply(`❌ Gagal mendapatkan undangan grup. Pastikan ID grup valid dan bot memiliki akses.`);
    }
};

// Properti handler
handler.help = ['invitegroup <id_grup>'];
handler.tags = ['group'];
handler.command = /^(invitegroup|undanggrup)$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;