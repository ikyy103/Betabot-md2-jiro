let handler = async (m, { conn }) => {
    let users = global.db.data.users || {}; // Data pengguna
    let user = users[m.sender];

    // Pastikan pengguna ada di database
    if (!user) {
        users[m.sender] = { money: 0, exp: 0, limit: 0, username: m.pushName || 'User', lastClaim: 0 };
        user = users[m.sender];
    }

    let currentTime = new Date();
    let lastClaim = user.lastClaim || 0;

    // Cek apakah sudah 1 hari sejak klaim terakhir
    if (currentTime - lastClaim < 24 * 60 * 60 * 1000) {
        let nextClaim = new Date(lastClaim + 24 * 60 * 60 * 1000);
        let remainingTime = nextClaim - currentTime;
        let hours = Math.floor(remainingTime / (60 * 60 * 1000));
        let minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        return m.reply(`❌ Anda sudah klaim hari ini. Silakan klaim kembali dalam ${hours} jam ${minutes} menit.`);
    }

    // Cek apakah user memiliki limit
    if (user.limit > 0) {
        return m.reply(`❌ Anda masih memiliki limit sebanyak ${user.limit}. Fitur free limit hanya untuk pengguna tanpa limit.`);
    }

    // Berikan limit gratis
    user.limit += 10;
    user.lastClaim = currentTime.getTime(); // Simpan waktu klaim terakhir

    return m.reply(`🎉 Selamat! Anda telah mendapatkan 10 limit gratis.\n\n🛡 Total Limit Sekarang: ${user.limit}`);
};

handler.help = ['freelimit'];
handler.tags = ['main'];
handler.command = /^(freelimit)$/i;

module.exports = handler;