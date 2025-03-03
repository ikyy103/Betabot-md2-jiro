let handler = async (m, { args }) => {
    let code = args[0];
    if (!code) throw 'Gunakan format: .redeem <kode>';

    // Ambil data kode redeem dari database
    let redeemCode = global.db.data.redeemCodes[code];
    if (!redeemCode) throw 'Kode redeem tidak valid atau sudah kedaluwarsa!';

    // Cek apakah kode sudah expired
    if (Date.now() > redeemCode.expireTimestamp) {
        delete global.db.data.redeemCodes[code]; // Hapus kode jika sudah expired
        throw 'Kode redeem ini sudah kedaluwarsa!';
    }

    // Cek apakah klaim sudah mencapai batas maksimum
    if (redeemCode.claimedBy.length >= redeemCode.maxClaims) {
        throw 'Kode redeem ini sudah mencapai batas klaim maksimum!';
    }

    // Berikan hadiah berdasarkan tipe
    let { type, reward } = redeemCode;
    let user = global.db.data.users[m.sender]; // Data pengguna yang klaim

    if (!user) throw 'Pengguna tidak ditemukan di database!';

    switch (type) {
        case 'limit':
            user.limit = (user.limit || 0) + reward;
            break;
        case 'money':
            user.money = (user.money || 0) + reward;
            break;
        case 'xp':
            user.xp = (user.xp || 0) + reward;
            break;
        case 'premium':
            user.premium = true;
            user.premiumExpire = Date.now() + reward * 24 * 60 * 60 * 1000; // Tambah waktu premium (reward dalam hari)
            break;
        default:
            throw `Tipe hadiah "${type}" tidak dikenali!`;
    }

    // Tandai kode telah digunakan oleh pengguna ini
    redeemCode.claimedBy.push(m.sender);

    // Kirim pesan konfirmasi ke pengguna
    m.reply(
        `🎉 *Selamat!*\n` +
        `Anda berhasil menggunakan kode redeem.\n\n` +
        `🎁 *Hadiah*: ${reward} ${type}\n` +
        `👤 *Klaim Oleh*: @${m.sender.split('@')[0]}\n` +
        `⏰ *Kode Expired*: ${new Date(redeemCode.expireTimestamp).toLocaleString('id')}`,
        null,
        { mentions: [m.sender] }
    );
};

handler.help = ['redeem <kode>'];
handler.tags = ['main'];
handler.command = /^(redeem|klaim)$/i;

module.exports = handler;