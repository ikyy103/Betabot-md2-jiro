let handler = async (m, { conn, usedPrefix, command, args }) => {
    const MIN_SEDEKAH_LIMIT = 50000;
    const MINIMUM_USER_LIMIT = 10;
    let totalLimitDonasi = global.totalLimitDonasi || 0;
    let totalMoneyDonasi = global.totalMoneyDonasi || 0;
    let sedekahData = global.sedekahData || [];

    // Mengambil data user yang ingin bersedekah
    let userData = global.db.data.users[m.sender];

    if (!args[0] || isNaN(args[0])) {
        return m.reply(`⚠️ Harap masukkan jumlah limit atau money yang ingin Anda sedekahkan.`);
    }

    let jumlah = parseInt(args[0]);
    let jenis = args[1] ? args[1].toLowerCase() : '';

    if (!['limit', 'money'].includes(jenis)) {
        return m.reply(`⚠️ Silakan pilih jenis yang ingin disedekahkan (limit/money).`);
    }
    if (jumlah <= 0) {
        return m.reply(`⚠️ Jumlah harus lebih besar dari 0.`);
    }

    // Mengecek apakah user memiliki jumlah yang cukup
    if (jenis === 'limit' && userData.limit < jumlah) {
        return m.reply(`⚠️ Anda tidak memiliki cukup limit untuk bersedekah.`);
    }
    if (jenis === 'money' && userData.money < jumlah) {
        return m.reply(`⚠️ Anda tidak memiliki cukup uang untuk bersedekah.`);
    }

    // Mengurangi jumlah dari user dan menambahkan ke total donasi
    if (jenis === 'limit') {
        userData.limit -= jumlah;
        totalLimitDonasi += jumlah;
    } else if (jenis === 'money') {
        userData.money -= jumlah;
        totalMoneyDonasi += jumlah;
    }

    // Menambahkan data sedekah untuk pencatatan
    sedekahData.push({
        user: m.sender,
        jumlah: jumlah,
        jenis: jenis,
        timestamp: Date.now()
    });

    // Ucapan terima kasih dan motivasi
    let motivasi = [
        "Kebaikanmu adalah sinar harapan untuk mereka yang membutuhkan.",
        "Sedekahmu menjadi amal jariyah yang tak akan putus.",
        "Terima kasih atas keikhlasanmu. Dunia ini lebih baik karena kebaikanmu."
    ];
    let pesanTerimaKasih = `✨ *Ucapan Terima Kasih* ✨\nTerima kasih, @${m.sender.split('@')[0]}, atas sedekahmu sebesar ${jumlah} ${jenis}.\n${motivasi[Math.floor(Math.random() * motivasi.length)]}`;

    // Kirim pesan terima kasih
    await conn.sendMessage(m.chat, { text: pesanTerimaKasih, mentions: [m.sender] });

    // Cek jika sudah mencapai batas minimal untuk pembagian donasi
    if (totalLimitDonasi >= MIN_SEDEKAH_LIMIT || totalMoneyDonasi >= MIN_SEDEKAH_LIMIT) {
        let users = Object.keys(global.db.data.users).filter(user => {
            let data = global.db.data.users[user];
            return data.limit < MINIMUM_USER_LIMIT || data.money < MINIMUM_USER_LIMIT;
        });

        // Membagikan donasi
        let jumlahPenerima = users.length;
        if (jumlahPenerima > 0) {
            let pembagianLimit = jumlahPenerima > 0 ? Math.floor(totalLimitDonasi / jumlahPenerima) : 0;
            let pembagianMoney = jumlahPenerima > 0 ? Math.floor(totalMoneyDonasi / jumlahPenerima) : 0;

            for (let user of users) {
                let userData = global.db.data.users[user];
                userData.limit += pembagianLimit;
                userData.money += pembagianMoney;
            }

            // Reset total donasi
            global.totalLimitDonasi = 0;
            global.totalMoneyDonasi = 0;

            let pesanDistribusi = `📢 *Distribusi Sedekah* 📢\nTerima kasih kepada semua pengguna yang telah bersedekah! Limit dan uang telah dibagikan rata kepada mereka yang membutuhkan.`;
            await conn.sendMessage(m.chat, { text: pesanDistribusi });
        }
    }

    // Tambahkan bonus ke user setelah satu hari
    setTimeout(() => {
        let bonus = jumlah * 2;
        if (jenis === 'limit') {
            userData.limit += bonus;
        } else {
            userData.money += bonus;
        }

        let pesanBonus = `🎉 *Bonus Sedekah* 🎉\n@${m.sender.split('@')[0]}, Anda telah menerima bonus dua kali lipat dari sedekah Anda sebesar ${bonus} ${jenis}. Terima kasih telah berbagi kebaikan!`;
        conn.sendMessage(m.chat, { text: pesanBonus, mentions: [m.sender] });
    }, 24 * 60 * 60 * 1000); // 24 jam
};

// Global variable initialization
global.totalLimitDonasi = global.totalLimitDonasi || 0;
global.totalMoneyDonasi = global.totalMoneyDonasi || 0;
global.sedekahData = global.sedekahData || [];

handler.help = ['sedekah'];
handler.tags = ['rpg'];
handler.command = /^sedekah$/i;

module.exports = handler;