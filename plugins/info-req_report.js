let handler = async (m, { conn, text, command }) => {
    if (!text) throw `Silakan masukkan pesan yang ingin Anda ${command}.\n\nContoh: .${command} Fitur brat | error 404`;

    const ownerNumber = global.owner[0] + '@s.whatsapp.net'; // Ganti sesuai nomor owner
    const sender = m.sender;
    const name = conn.getName(sender);
    const messageType = command === 'request' ? 'Permintaan' : 'Laporan';

    // Format pesan yang akan dikirim ke owner
    const msg = `
📨 *${messageType} dari User*
    
👤 *Nama*: ${name}
📞 *Nomor*: wa.me/${sender.split('@')[0]}

📝 *Pesan*:
${text}

Silakan tanggapi jika diperlukan.
`.trim();

    // Kirim pesan ke owner
    await conn.sendMessage(ownerNumber, { text: msg }, { quoted: m });

    // Balasan untuk user
    m.reply(`✅ Pesan Anda berhasil dikirim ke owner.\nTerima kasih atas ${messageType.toLowerCase()} Anda!`);
};

handler.help = ['request <pesan>', 'report <pesan>'];
handler.tags = ['info'];
handler.command = /^(request|report)$/i;

module.exports = handler;