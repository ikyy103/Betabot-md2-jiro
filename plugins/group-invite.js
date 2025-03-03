let handler = async (m, { conn, args, usedPrefix }) => {
    // Cek apakah bot adalah admin di grup
    if (!m.isGroup) throw 'Perintah ini hanya dapat digunakan di dalam grup!';
    let groupMetadata = await conn.groupMetadata(m.chat);
    let botAdmin = groupMetadata.participants.find((p) => p.id === conn.user.jid && p.admin);
    if (!botAdmin) throw 'Bot harus menjadi admin untuk menggunakan perintah ini!';

    // Validasi nomor tujuan
    let target = args[0];
    if (!target) throw `Gunakan format:\n${usedPrefix}invite <nomor>\n\nContoh: ${usedPrefix}invite 6281234567890`;
    if (!/^\d+$/.test(target)) throw 'Nomor yang diberikan tidak valid!';

    // Tambahkan @s.whatsapp.net ke nomor
    let targetJid = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    // Dapatkan tautan undangan grup
    let inviteCode = await conn.groupInviteCode(m.chat);
    let groupName = groupMetadata.subject;
    let inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

    // Kirim pesan ke target
    try {
        await conn.sendMessage(targetJid, {
            text: `Halo! 👋\n\nAnda diundang untuk bergabung ke grup *${groupName}*.\nKlik tautan berikut untuk bergabung:\n\n${inviteLink}\n\nKami menantikan kehadiran Anda!`,
        });
        m.reply(`✅ Undangan berhasil dikirim ke ${target}`);
    } catch (e) {
        m.reply(`❌ Gagal mengirim undangan ke ${target}. Pastikan nomor aktif di WhatsApp.`);
    }
};

handler.help = ['invite <nomor>'];
handler.tags = ['group'];
handler.command = /^(invite|undang)$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;