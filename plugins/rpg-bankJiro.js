let handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender]; // Data pengguna

    // Inisialisasi akun bank pengguna jika belum ada
    if (!user.bankAccount) {
        user.bankAccount = {
            balance: 0, // Saldo awal
            accountNumber: Math.floor(Math.random() * 1000000000), // Nomor rekening acak
            level: 1, // Level bank
            username: m.sender.split('@')[0], // Username pengguna
            xp: 0, // XP awal
            limit: 1000000, // Limit saldo
            isPremium: false, // Status premium
        };
    }

    const bank = user.bankAccount;

    // Perintah untuk mengecek saldo
    if (command === "saldo") {
        const saldoMessage = `
🌍 *Bank Internasional* 🌍

🔢 *Nomor Rekening*: ${bank.accountNumber || "Belum Terdaftar"}
💰 *Saldo Bank*: Rp${(bank.balance || 0).toLocaleString()}
👤 *Username*: ${bank.username || "Tidak Diketahui"}
🎮 *Level*: ${bank.level || 1}
🔸 *XP*: ${bank.xp || 0}
💵 *Money*: Rp${(user.money || 0).toLocaleString()}
💳 *Limit*: Rp${(bank.limit || 0).toLocaleString()}
🏅 *Premium*: ${bank.isPremium ? "✅ Yes" : "❌ No"}

Gunakan perintah berikut untuk transaksi:
- *${usedPrefix}buatbank*: Membuat akun Bank Internasional.
- *${usedPrefix}tfbank <nomor rekening> <jumlah>*: Transfer uang antar bank.
- *${usedPrefix}setorbank <jumlah>*: Menyetor uang ke Bank.
- *${usedPrefix}tarikbank <jumlah>*: Menarik uang dari Bank.
        `;
        return conn.reply(m.chat, saldoMessage, m);
    }

    // Membuat akun Bank Internasional
    if (command === "buatbank") {
        if (bank.balance > 0) return m.reply("⚠️ Kamu sudah memiliki akun Bank Internasional!");
        bank.balance = 0;
        return m.reply("✅ Akun Bank Internasional berhasil dibuat!\nGunakan perintah *${usedPrefix}saldo* untuk melihat informasi akun.");
    }

    // Menyetor uang ke Bank Internasional
    if (command === "setorbank") {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) return m.reply("⚠️ Masukkan jumlah setoran yang valid!");
        if (user.money < amount) return m.reply("⚠️ Uangmu tidak mencukupi!");

        user.money -= amount;
        bank.balance += amount;
        return m.reply(`✅ Setoran berhasil!\nJumlah: Rp${amount.toLocaleString()}\nSaldo Bank: Rp${bank.balance.toLocaleString()}`);
    }

    // Menarik uang dari Bank Internasional
    if (command === "tarikbank") {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) return m.reply("⚠️ Masukkan jumlah penarikan yang valid!");
        if (bank.balance < amount) return m.reply("⚠️ Saldo di bank tidak mencukupi!");

        user.money += amount;
        bank.balance -= amount;
        return m.reply(`✅ Penarikan berhasil!\nJumlah: Rp${amount.toLocaleString()}\nSaldo Bank: Rp${bank.balance.toLocaleString()}`);
    }

    // Transfer uang antar bank
    if (command === "tfbankj") {
        const targetAccount = args[0];
        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) return m.reply("⚠️ Masukkan jumlah transfer yang valid!");
        if (bank.balance < amount) return m.reply("⚠️ Saldo di bank tidak mencukupi!");

        const targetUser = Object.values(global.db.data.users).find(u => u.bankAccount?.accountNumber == targetAccount);
        if (!targetUser) return m.reply("⚠️ Nomor rekening tujuan tidak valid!");

        // Transfer uang
        bank.balance -= amount;
        targetUser.bankAccount.balance += amount;

        return m.reply(`✅ Transfer berhasil!\nJumlah: Rp${amount.toLocaleString()}\nSaldo Bankmu: Rp${bank.balance.toLocaleString()}`);
    }
};

// Daftar perintah
handler.help = ["saldo", "buatbank", "setorbank", "tarikbank", "tfbankj"];
handler.tags = ["rpg"];
handler.command = ["saldo", "buatbank", "setorbank", "tarikbank", "tfbankj"];
handler.group = true;
handler.register = true;

module.exports = handler;