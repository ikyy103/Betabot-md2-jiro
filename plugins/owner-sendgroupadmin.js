let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `⚠️ Masukkan ID grup!\n\nContoh: ${usedPrefix + command} <group-id> Pesan Anda`;

    let groupId = args[0];
    let message = args.slice(1).join(' ');
    if (!message) throw `⚠️ Masukkan pesan yang ingin dikirim!`;

    try {
        // Fetch group metadata
        let groupMetadata = await conn.groupMetadata(groupId);
        let adminIds = groupMetadata.participants
            .filter(member => member.admin)
            .map(admin => admin.id);

        if (adminIds.length === 0) throw `❌ Tidak ada admin di grup ini!`;

        // Kirim pesan ke admin grup
        for (let admin of adminIds) {
            await conn.sendMessage(admin, { 
                text: `📢 *Pesan dari Owner Bot untuk Grup ${groupMetadata.subject}:*\n\n${message}`,
                mentions: [admin]
            });
        }

        m.reply(`✅ Pesan berhasil dikirim ke admin grup ${groupMetadata.subject}`);
    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat mengirim pesan. Pastikan ID grup valid dan bot masih berada di grup tersebut.');
    }
};

handler.command = /^sendgroupadmin$/i;
handler.tags = ['owner'];
handler.help = ['sendgroupadmin <group-id> <pesan>'];
handler.owner = true;

module.exports = handler;