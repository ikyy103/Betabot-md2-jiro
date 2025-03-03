let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Group ID khusus untuk menerima laporan
    const laporanGroupID = '120363362660999733@g.us'; // Ganti dengan ID group laporan Anda

    // Waktu pelaporan
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let time = `${hours}:${minutes}`;

    // Informasi group dan pelapor
    let groupName = (await conn.groupMetadata(m.chat)).subject || 'Group Tidak Diketahui';
    let groupId = m.chat;
    let senderName = conn.getName(m.sender);

    // Template pesan laporan
    let laporan = `
🚩 *LAPORAN GROUP CULIK BOT* 🚩

📌 *Nama Group*: ${groupName}
🆔 *ID Group*: ${groupId}
🕒 *Dilaporkan Pada*: ${time} WIB
👤 *Dilaporkan Oleh*: ${senderName}

⚠️ *Keterangan*: Group ini terdeteksi menculik bot. Segera lakukan tindakan yang diperlukan!
    `.trim();

    try {
        // Kirim laporan ke group khusus
        await conn.sendMessage(laporanGroupID, { text: laporan });
        // Kirim konfirmasi ke group yang melaporkan
        m.reply(`✅ *Laporan telah dikirim!*\nLaporan mengenai group ini berhasil dikirim ke group khusus laporan.`);
    } catch (e) {
        // Jika gagal mengirim laporan
        m.reply(`❌ *Gagal mengirim laporan!*\nMohon coba lagi atau hubungi owner.`);
        console.error(e);
    }
};

handler.help = ['laporculik'];
handler.tags = ['bot'];
handler.command = /^laporculik$/i;

module.exports = handler;