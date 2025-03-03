let handler = async (m, { conn, args, command }) => {
    let users = global.db.data.users || {}; // Data pengguna
    let bank = global.db.data.bank || {}; // Data bank

    // Pastikan pengguna telah terdaftar
    if (!users[m.sender]) {
        users[m.sender] = { money: 0, exp: 0, limit: 0, username: m.pushName || 'User' };
    }

    if (command === 'daftarlimitbackup') {
        if (bank[m.sender]) return m.reply('❌ Anda sudah terdaftar di sistem bank.');

        bank[m.sender] = {
            money: users[m.sender].money || 0,
            exp: users[m.sender].exp || 0,
            limit: users[m.sender].limit || 0,
            username: users[m.sender].username || 'User',
            deposit: 0, // Total simpanan
        };

        return m.reply(`✅ Anda telah berhasil mendaftar di sistem bank.\nUsername: ${bank[m.sender].username}`);
    }

    if (command === 'masukkanbank') {
        let amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) throw 'Masukkan jumlah yang valid.';

        if (users[m.sender].money < amount) throw `Saldo Anda tidak cukup! Anda hanya memiliki ${users[m.sender].money} uang.`;

        bank[m.sender].deposit += amount; // Tambahkan ke simpanan
        users[m.sender].money -= amount; // Kurangi uang user

        return m.reply(`✅ Berhasil menyimpan ${amount} uang ke bank.\nTotal simpanan Anda sekarang: ${bank[m.sender].deposit}`);
    }

    if (command === 'bayarbunga') {
        if (!bank[m.sender] || bank[m.sender].deposit <= 0) throw 'Anda tidak memiliki simpanan untuk membayar bunga.';

        let deposit = bank[m.sender].deposit;
        let bunga = Math.ceil(deposit * 0.05); // Hitung bunga (5% dari simpanan)
        let potongan = Math.max(10, bunga); // Pastikan bunga minimum adalah 10

        // Kurangi uang dan limit user untuk membayar bunga
        if (users[m.sender].money < potongan || users[m.sender].limit < 1) {
            throw `❌ Anda tidak memiliki cukup uang atau limit untuk membayar bunga!\nDiperlukan: ${potongan} uang dan 1 limit.`;
        }

        users[m.sender].money -= potongan;
        users[m.sender].limit -= 1;

        return m.reply(`✅ Anda telah membayar bunga sebesar ${potongan} uang dan 1 limit.\nSisa uang Anda: ${users[m.sender].money}`);
    }

    if (command === 'info') {
        if (!bank[m.sender]) throw 'Anda belum terdaftar di sistem bank. Gunakan perintah *.daftarlimitbackup* untuk mendaftar.';

        let { deposit } = bank[m.sender];
        let bunga = Math.ceil(deposit * 0.05);

        return m.reply(
            `💳 *Info Bank*\n` +
            `👤 *Username*: ${bank[m.sender].username}\n` +
            `💰 *Simpanan*: ${deposit}\n` +
            `📈 *Bunga*: ${bunga} (5% dari simpanan)\n\n` +
            `Gunakan *.bayarbunga* untuk membayar bunga.`
        );
    }
};

handler.help = ['daftarlimitbackup', 'masukkanbank <jumlah>', 'bayarbunga', 'info'];
handler.tags = ['bank','rpg'];
handler.command = /^(daftarlimitbackup|masukkanbank|bayarbunga|info)$/i;

module.exports = handler;