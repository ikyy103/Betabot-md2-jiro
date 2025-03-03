let handler = async (m, { conn, args, text, command }) => {
    if (!args.length) {
        return m.reply(`📞 *Cara Menggunakan:*\n\nPilih salah satu:\n- *${command} @tag* → Menelpon pengguna tertentu.\n- *${command} grup* → Menelpon semua anggota grup.`);
    }

    if (m.mentionedJid.length > 0) {
        let mentions = m.mentionedJid.map(jid => `@${jid.split('@')[0]}`).join(', ');
        conn.sendMessage(m.chat, { 
            text: `📞 *Menelpon ${mentions}...*`, 
            mentions: m.mentionedJid 
        }, { quoted: m });
    } else if (text.toLowerCase() === 'grup') {
        let participants = (await conn.groupMetadata(m.chat)).participants.map(v => v.id);
        let mentions = participants.map(jid => `@${jid.split('@')[0]}`).join(', ');

        conn.sendMessage(m.chat, { 
            text: `📞 *Menelpon semua anggota grup...*\n${mentions}`, 
            mentions: participants 
        }, { quoted: m });
    } else {
        return m.reply(`⚠️ *Format salah!*\n\nGunakan:\n- *${command} @tag* → Untuk menelpon pengguna tertentu.\n- *${command} grup* → Untuk menelpon semua anggota grup.`);
    }
}

handler.help = ['call']
handler.tags = ['tools']
handler.command = /^call$/i

module.exports = handler;