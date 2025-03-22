let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]; // Data pengguna
    
    if (!user) return conn.reply(m.chat, "❌ Anda belum terdaftar di database.", m);

    // Ambil informasi pengguna
    let username = user.username || m.name; // Jika username tidak ada, gunakan nama di WhatsApp
    let isPremium = user.premium ? "✅ Ya" : "❌ Tidak";
    let saldoDana = user.dana || 0; // Jumlah saldo Dana pengguna
    let totalTransaksi = user.totalTransaksi || 0; // Total transaksi pengguna

    let info = `
📌 *Informasi Pengguna*
👤 *Username:* ${username}
⭐ *User Premium:* ${isPremium}
💰 *Saldo Dana:* Rp${saldoDana.toLocaleString('id-ID')}
🔄 *Total Transaksi:* ${totalTransaksi.toLocaleString('id-ID')}

🔹 Untuk menambah saldo, gunakan perintah *!deposit <jumlah>*
    `.trim();

    conn.reply(m.chat, info, m);
};

handler.help = ['cekinfo'];
handler.tags = ['info','topup'];
handler.command = /^(cekinfo|infoku)$/i; // Perintah untuk cek informasi diri sendiri
handler.register = true; // Hanya untuk pengguna yang terdaftar

module.exports = handler;