let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const biayaRitual = 500; // Biaya untuk menggunakan jasa dukun
    const hasilKemungkinan = [
        { hasil: 'Keberuntungan besar menantimu! (+1000 XP)', xp: 1000, money: 500, message: 'Berhasil!' },
        { hasil: 'Diberkati oleh dewa (+500 Money)', xp: 0, money: 500, message: 'Keberuntungan finansial!' },
        { hasil: 'Kena sial! (-200 Money)', xp: 0, money: -200, message: 'Hati-hati di lain waktu.' },
        { hasil: 'Ritual gagal (-100 XP)', xp: -100, money: 0, message: 'Dukun sedang tidak fokus.' },
        { hasil: 'Kamu mendapatkan jimat sakti (+50 XP & +100 Money)', xp: 50, money: 100, message: 'Jimat berhasil didapatkan!' },
        { hasil: 'Dewa keberuntungan memberkati (+2000 Money)', xp: 0, money: 2000, message: 'Rezeki nomplok!' },
    ];

    // Cek apakah user memiliki cukup uang untuk melakukan ritual
    if (user.money < biayaRitual) {
        return conn.reply(
            m.chat,
            `❌ Uang kamu tidak cukup untuk melakukan ritual dukun.\n\n💵 *Biaya Ritual:* ${biayaRitual} Money\n💰 *Uang kamu:* ${user.money} Money`,
            m
        );
    }

    user.money -= biayaRitual;

    // Pilih hasil secara acak
    const hasil = hasilKemungkinan[Math.floor(Math.random() * hasilKemungkinan.length)];

    // Update XP dan Money berdasarkan hasil
    user.exp += hasil.xp;
    user.money += hasil.money;

    // Kirim hasil ke pengguna
    conn.reply(
        m.chat,
        `🔮 *HASIL RITUAL DUKUN* 🔮\n\n` +
        `🌟 *Hasil:* ${hasil.hasil}\n` +
        `📈 *XP:* ${hasil.xp > 0 ? '+' : ''}${hasil.xp}\n` +
        `💵 *Money:* ${hasil.money > 0 ? '+' : ''}${hasil.money}\n\n` +
        `💬 *Pesan Dukun:* "${hasil.message}"\n\n` +
        `💰 *Sisa Uang Kamu:* ${user.money}`,
        m
    );
};

handler.help = ['dukun'];
handler.tags = ['rpg'];
handler.command = /^dukun$/i; // Perintah untuk memanggil dukun
handler.register = true;

module.exports = handler;