const fs = require('fs');
const path = './ramadhan_data.json';

const hadiahList = [
    { name: "Buku Islami", price: 50 },
    { name: "Tasbih Digital", price: 75 },
    { name: "Mushaf Al-Qur'an", price: 100 },
    { name: "Sarung", price: 120 },
    { name: "Peci", price: 90 }, 
    { name: "premium", price: 500 }
];

const readData = () => {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
};

const saveData = (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user = m.sender;
    let users = readData();
    if (!users[user]) users[user] = { zakat: false, lastPahala: 0, lastHadiah: 0, lastAyat: 0, takjil: 3, balance: 0, points: 0 };

    let now = Date.now();

    if (command === 'berburuzakat') {
        if (users[user].zakat) return m.reply(`✅ Kamu sudah berburu zakat hari ini.`);
        let zakatInfo = "💰 Zakat fitrah: 2,5 kg beras atau setara uang.";
        users[user].zakat = true;
        saveData(users);
        m.reply(`📢 **Info Zakat:**\n${zakatInfo}`);
    }

    if (command === 'kumpulpahala') {
        if (now - users[user].lastPahala < 2 * 60 * 60 * 1000) {
            let remaining = ((2 * 60 * 60 * 1000) - (now - users[user].lastPahala)) / 1000;
            throw `⏳ Tunggu ${Math.ceil(remaining / 60)} menit untuk mengumpulkan pahala lagi.`;
        }
        let pahala = Math.floor(Math.random() * 20) + 10;
        users[user].balance += pahala;
        users[user].lastPahala = now;
        saveData(users);
        m.reply(`🌟 Kamu mendapatkan **${pahala} pahala** dari ibadah hari ini!`);
    }

    if (command === 'bagitakjil') {
        if (users[user].takjil <= 0) return m.reply(`❌ Kamu tidak memiliki takjil.`);
        let receiver = text ? text : "Temanmu";
        users[user].takjil--;
        saveData(users);
        m.reply(`🎁 Kamu berbagi takjil dengan **${receiver}**! Semoga berkah.`);
    }

    if (command === 'sahurhadiah') {
        if (now - users[user].lastHadiah < 24 * 60 * 60 * 1000) return m.reply(`⏳ Kamu sudah mengambil hadiah sahur hari ini.`);
        let hadiah = Math.floor(Math.random() * 100) + 50;
        users[user].points += hadiah;
        users[user].lastHadiah = now;
        saveData(users);
        m.reply(`🎁 Kamu mendapatkan **${hadiah} poin** dari berkah sahur!`);
    }

    if (command === 'berburuayat') {
        if (now - users[user].lastAyat < 2 * 60 * 60 * 1000) return m.reply(`⏳ Tunggu untuk berburu ayat lagi.`);
        let ayatList = [
            "📖 Al-Baqarah 2:286 - Allah tidak membebani seseorang melainkan sesuai kesanggupannya.",
            "📖 Al-Mulk 67:2 - Allah menciptakan mati dan hidup untuk menguji siapa yang terbaik amalannya.",
            "📖 An-Nahl 16:125 - Serulah ke jalan Tuhanmu dengan hikmah dan pelajaran yang baik."
        ];
        let ayat = ayatList[Math.floor(Math.random() * ayatList.length)];
        users[user].lastAyat = now;
        saveData(users);
        m.reply(`📜 **Ayat Al-Qur'an untukmu:**\n${ayat}`);
    }

    if (command === 'belihadiah') {
        let hadiahData = hadiahList.map(h => `🎁 ${h.name} - **${h.price} Poin**`).join('\n');
        m.reply(`🛍 **Daftar Hadiah yang Bisa Dibeli:**\n${hadiahData}\n\nGunakan *${usedPrefix}belihadiah <nama hadiah>* untuk membeli.`);
    }

    if (command.startsWith('belihadiah ')) {
        let hadiahName = text.trim();
        let hadiah = hadiahList.find(h => h.name.toLowerCase() === hadiahName.toLowerCase());
        if (!hadiah) return m.reply(`❌ Hadiah tidak ditemukan.`);
        if (users[user].points < hadiah.price) return m.reply(`❌ Poin kamu tidak cukup.`);
        users[user].points -= hadiah.price;
        saveData(users);
        m.reply(`✅ Kamu membeli **${hadiah.name}**!`);
    }
};

handler.help = ['berburuzakat', 'kumpulpahala', 'bagitakjil <nama>', 'sahurhadiah', 'berburuayat', 'belihadiah'];
handler.tags = ['game'];
handler.command = /^(berburuzakat|kumpulpahala|bagitakjil|sahurhadiah|berburuayat|belihadiah)$/i;
handler.limit = true;

module.exports = handler;