let handler = async (m, { conn, args, text }) => {
    if (!args[0]) throw `⚠️ Masukkan ID grup!\n\nContoh:\n.sendto 1203630250000-123456@g.us Pesan Anda`;
    if (!text) throw `⚠️ Masukkan pesan untuk dikirim!\n\nContoh:\n.sendto 1203630250000-123456@g.us Pesan Anda`;

    let groupId = args[0]; 
    let message = args.slice(1).join(' '); 

    try {
        let groupMetadata = await conn.groupMetadata(groupId); 
        let allParticipants = groupMetadata.participants.map(v => v.id); 

        await conn.sendMessage(
            groupId, 
            { 
                text: `📢 *Pesan dari Owner:* \n\n${message}\n\n@everyone`, 
                mentions: allParticipants 
            }
        );

        m.reply(`✅ Pesan berhasil dikirim ke grup dengan ID: ${groupId}`);
    } catch (e) {
        console.error(e);
        m.reply(`❌ Gagal mengirim pesan. Pastikan ID grup benar dan bot adalah anggota grup.`);
    }
};

handler.help = ['sendto <idgroup> <pesan>'];
handler.tags = ['group'];
handler.command = /^sendto$/i;

handler.owner = true; // Hanya untuk owner

module.exports = handler;