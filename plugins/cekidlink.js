let handler = async (m, { conn, text }) => {
    if (!text && !m.quoted) throw 'Silakan masukkan link grup atau channel!\n\nContoh: *cekid https://chat.whatsapp.com/ABCDEFG12345* atau *cekid https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w*';

    // Ambil link dari teks atau kutipan
    let link = text || (m.quoted && m.quoted.text);

    // Validasi link grup
    let groupLinkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    // Validasi link channel
    let channelLinkRegex = /https:\/\/whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

    let groupCode = (link.match(groupLinkRegex) || [])[1];
    let channelCode = (link.match(channelLinkRegex) || [])[1];

    if (!groupCode && !channelCode) throw 'Link tidak valid! Pastikan itu adalah link grup atau channel WhatsApp.';

    try {
        if (groupCode) {
            // Dapatkan informasi grup
            try {
                let groupInfo = await conn.groupGetInviteInfo(groupCode);
                let caption = `🔍 *Informasi Grup*\n\n` +
                              `📂 *ID Grup:* ${groupInfo.id}\n` +
                              `📝 *Nama Grup:* ${groupInfo.subject}\n` +
                              `👤 *Jumlah Anggota:* ${groupInfo.size}\n` +
                              `⏰ *Dibuat Pada:* ${new Date(groupInfo.creation * 1000).toLocaleString('id')}\n` +
                              `🛡️ *Admin Grup:* ${groupInfo.owner ? `@${groupInfo.owner.split('@')[0]}` : 'Tidak diketahui'}\n` +
                              `🔗 *Link Grup:* ${link}`;
                // Kirim informasi grup
                m.reply(caption, null, { mentions: [groupInfo.owner] });
            } catch (e) {
                console.error(e);
                // Jika metadata grup gagal diambil, hanya tampilkan ID grup
                m.reply(`No Info :( ID Grup: ${groupCode}`);
            }
        } else if (channelCode) {
            // Dapatkan informasi channel
            try {
                let channelInfo = await conn.channelGetInfo(channelCode);
                let caption = `🔍 *Informasi Channel*\n\n` +
                              `📂 *ID Channel:* ${channelInfo.id}\n` +
                              `📝 *Nama Channel:* ${channelInfo.name}\n` +
                              `👤 *Jumlah Anggota:* ${channelInfo.membersCount}\n` +
                              `⏰ *Dibuat Pada:* ${new Date(channelInfo.createdAt * 1000).toLocaleString('id')}\n` +
                              `🔗 *Link Channel:* ${link}`;
                // Kirim informasi channel
                m.reply(caption);
            } catch (e) {
                console.error(e);
                // Jika metadata channel gagal diambil, hanya tampilkan ID channel
                m.reply(`No Info :( ID Channel: ${channelCode}`);
            }
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan dalam mengambil metadata. Pastikan link grup atau channel benar dan aktif.');
    }
};

handler.command = /^(cekidlink|idlink)$/i;
handler.tags = ['tools'];
handler.help = ['cekidlink <link_grup_or_channel>'];
handler.group = false; // Tidak perlu berada di grup
handler.admin = false;

module.exports = handler;