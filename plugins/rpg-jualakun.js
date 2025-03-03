let handler = async (m, { conn, args, command, usedPrefix }) => {
    const platforms = ['youtube', 'tiktok', 'twitter', 'discord']; // Platform yang didukung

    // Validasi input platform
    let platform = args[0]?.toLowerCase();
    if (!platform || !platforms.includes(platform)) {
        throw `🚩 Gunakan format:\n${usedPrefix}${command} <platform> <nama_channel>\n\n*Platform yang didukung:* ${platforms.join(', ')}\n\nContoh: ${usedPrefix}${command} youtube MyChannel123`;
    }

    // Validasi nama channel
    let channelName = args.slice(1).join(' ');
    if (!channelName) throw '❌ Masukkan nama channel yang ingin dijual!';

    // Periksa data pengguna
    let user = global.db.data.users[m.sender];
    if (!user) throw '❌ Data pengguna tidak ditemukan.';

    // Periksa apakah platform dan nama channel sudah terdaftar
    let platformData = user.channels?.[platform] || {}; // Ambil data platform pengguna
    let channelData = platformData[channelName]; // Ambil data channel berdasarkan nama

    if (!channelData) {
        throw `❌ Channel "${channelName}" pada platform ${platform.toUpperCase()} tidak ditemukan atau belum terdaftar!`;
    }

    // Perhitungan harga akun
    let { subscribers, viewers, likes, awards } = channelData;
    let baseValue = 100; // Nilai dasar per unit pengukuran
    let money = Math.floor(subscribers * 2 + viewers * 0.1 + likes * 0.5) * baseValue;
    let exp = Math.floor((subscribers + viewers + likes) * 0.5); // EXP setengah total pengukuran
    let limit = awards.length > 0 ? 50 : 20; // Limit lebih besar jika ada penghargaan

    if (awards.length > 0) {
        money *= 2; // Naik 2x jika ada penghargaan
        exp *= 2;
    }

    // Hapus data channel setelah penjualan
    delete user.channels[platform][channelName];

    // Tambahkan hasil ke pengguna
    user.money = (user.money || 0) + money;
    user.exp = (user.exp || 0) + exp;
    user.limit = (user.limit || 0) + limit;

    // Respon penjualan
    let response = `
🛒 *Penjualan Akun ${platform.toUpperCase()}* 🛒

📊 *Nama Channel*: ${channelName}
👥 *Subscribers*: ${subscribers}
👀 *Viewers*: ${viewers}
👍 *Likes*: ${likes}
🏆 *Penghargaan*: ${awards.length > 0 ? awards.join(', ') : 'Tidak ada'}

🎁 *Hasil Penjualan:*
💵 *Money*: ${money}
📈 *EXP*: ${exp}
🔮 *Limit*: ${limit}

✅ Akun berhasil dijual! Silakan buat akun baru dengan nama channel berbeda.
    `.trim();

    m.reply(response);
};

// Struktur data pengguna untuk channel
global.db.data.users = global.db.data.users || {};
for (let jid in global.db.data.users) {
    global.db.data.users[jid].channels = global.db.data.users[jid].channels || {};
    for (let platform of ['youtube', 'tiktok', 'twitter', 'discord']) {
        global.db.data.users[jid].channels[platform] = global.db.data.users[jid].channels[platform] || {};
    }

    global.db.data.users[jid].money = global.db.data.users[jid].money || 0; // Default money
    global.db.data.users[jid].exp = global.db.data.users[jid].exp || 0; // Default exp
    global.db.data.users[jid].limit = global.db.data.users[jid].limit || 0; // Default limit
}

// Handler properti
handler.help = ['jualakun <platform> <nama_channel>'];
handler.tags = ['rpg'];
handler.command = /^(jualakun|sellaccount)$/i;

module.exports = handler;