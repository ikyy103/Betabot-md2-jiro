let handler = async (m, { conn }) => {
    let userData = global.db.data.users[m.sender];
    if (!userData) throw `Data pengguna tidak ditemukan.`;

    // Pastikan data utang ada
    userData.hutang = userData.hutang || { limit: 0, money: 0 };
    userData.pajak = userData.pajak || { totalDibayar: { limit: 0, money: 0 }, belumDibayar: { limit: 0, money: 0 } };

    let pesan = `📊 *Status Pajak Anda* 📊\n\n` +
        `💰 *Utang Pajak:*\n- Limit: ${userData.hutang.limit}\n- Money: ${userData.hutang.money}\n\n` +
        `✅ *Total Pajak yang Sudah Dibayar:*\n- Limit: ${userData.pajak.totalDibayar.limit}\n- Money: ${userData.pajak.totalDibayar.money}\n\n` +
        `⚠️ *Total Pajak yang Belum Dibayar:*\n- Limit: ${userData.pajak.belumDibayar.limit}\n- Money: ${userData.pajak.belumDibayar.money}`;

    // Mengirim pesan dengan pengaturan tambahan untuk memastikan pesan dikirim dengan benar
    await conn.sendMessage(m.chat, { text: pesan }, { quoted: m });
};

handler.help = ['pajakme'];
handler.tags = ['user'];
handler.command = /^pajakme$/i;

module.exports = handler;