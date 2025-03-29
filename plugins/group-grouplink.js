let handler = async (m, { conn, args }) => {
    if (!args[0]) throw 'Harap masukkan ID grup yang valid.';

    try {
        let group = await conn.groupMetadata(args[0]);
        if (!group) throw 'Grup tidak ditemukan atau Anda tidak memiliki akses ke grup tersebut.';

        let inviteCode = await conn.groupInviteCode(args[0]);
        let inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        m.reply(`Berikut adalah tautan undangan untuk grup "${group.subject}":\n${inviteLink}`);
    } catch (err) {
        if (err.message.includes('not-authorized')) {
            m.reply('Anda tidak memiliki izin untuk mendapatkan tautan undangan grup ini. Pastikan akun Anda adalah anggota dan memiliki hak yang diperlukan dalam grup tersebut ( Jadikan bot menjadi admin pada group tersebut untuk mendapatkan link group ).');
        } else {
            m.reply(`Terjadi kesalahan: ${err.message}`);
        }
    }
};

handler.help = ['getgrouplink <ID Grup>'];
handler.tags = ['group'];
handler.command = /^getgrouplink$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;