const handler = async (m, { conn, args }) => {
    const user = global.db.data.users[m.sender];
    const code = args[0]?.toUpperCase();

    // Cek jika kode ada
    if (!user.redeemCodes || !user.redeemCodes.some(r => r.code === code)) {
        return conn.reply(m.chat, `❌ Kode redeem tidak ditemukan atau sudah digunakan.`, m);
    }

    // Ambil kode yang cocok
    const redeem = user.redeemCodes.find(r => r.code === code);
    if (redeem.claimed) {
        return conn.reply(m.chat, `❌ Kode redeem sudah digunakan.`, m);
    }

    // Berikan hadiah tambahan (opsional, bisa disesuaikan)
    const limit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    const money = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    const exp = Math.floor(Math.random() * (200 - 100 + 1)) + 100;

    user.limit += limit;
    user.money += money;
    user.exp += exp;

    // Tandai kode sebagai digunakan
    redeem.claimed = true;

    conn.reply(m.chat, `🎉 Redeem berhasil!\n\n- 🎟 *Limit*: +${limit}\n- 💰 *Money*: +${money}\n- 🌟 *Exp*: +${exp}`, m);
};

handler.command = /^claimredeem$/i;
handler.help = ['claimredeem <kode>'];
handler.tags = ['game'];
handler.group = true;

module.exports = handler;