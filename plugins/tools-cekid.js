let handler = async (m, { conn, isGroup }) => {
    let idType = isGroup ? 'Group' : 'Channel';
    let id = m.chat;
    let caption = `🔍 *Informasi ${idType}*\n\n` +
                  `📂 *ID ${idType}:* ${id}\n` +
                  `📝 *Nama ${idType}:* ${m.isGroup ? (await conn.groupMetadata(id)).subject : 'Saluran'}`;

    // Kirim pesan dengan info ID
    m.reply(caption);
};

handler.command = /^(cekid|id)$/i;
handler.tags = ['tools'];
handler.help = ['cekid'];
handler.group = true;
handler.admin = false;

module.exports = handler;