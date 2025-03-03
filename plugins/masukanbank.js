let handler = async (m, { conn, args }) => {
    let bank = global.db.data.bank || {}; // Data bank global
    let users = global.db.data.users || {}; // Data user global

    if (!args[0]) throw `Gunakan format: .masukkanbank limit <jumlah>\nAtau gunakan .masukkanbank limit all untuk semua user.`;

    if (args[0] === 'limit') {
        if (args[1] === 'all') {
            // Memasukkan seluruh limit semua pengguna ke bank
            let totalLimit = 0;
            for (let user in users) {
                let userLimit = users[user].limit || 0;
                if (userLimit > 0) {
                    bank[user] = (bank[user] || 0) + userLimit; // Tambahkan ke bank
                    users[user].limit = 0; // Set limit user ke 0
                    totalLimit += userLimit;
                }
            }
            return m.reply(`✅ Seluruh limit dari semua pengguna berhasil dimasukkan ke bank.\nTotal limit yang dimasukkan: ${totalLimit}`);
        } else {
            // Memasukkan limit pengguna tertentu ke bank
            let amount = parseInt(args[1]);
            if (isNaN(amount) || amount <= 0) throw `Jumlah limit yang ingin dimasukkan harus angka dan lebih dari 0!`;

            let user = users[m.sender];
            if (!user) throw `Data pengguna tidak ditemukan.`;

            if (user.limit < amount) throw `Limit Anda tidak cukup! Anda hanya memiliki ${user.limit} limit.`;

            bank[m.sender] = (bank[m.sender] || 0) + amount; // Tambahkan ke bank
            user.limit -= amount; // Kurangi limit pengguna
            return m.reply(`✅ Berhasil memasukkan ${amount} limit ke bank.\nLimit tersisa: ${user.limit}`);
        }
    } else {
        throw `Jenis yang didukung hanya *limit*. Gunakan format:\n.masukbank limit <jumlah>\nAtau\n.masukbank limit all`;
    }
};

handler.help = ['masukkanbank limit <jumlah>', 'masukkanbank limit all'];
handler.tags = ['main'];
handler.command = /^(masukkanbank|masukbank)$/i;

module.exports = handler;