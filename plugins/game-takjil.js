const fs = require('fs');
const path = './takjil_data.json';

// Data takjil & harga
const takjilList = [
    { name: "Kolak Pisang", price: 5000 },
    { name: "Es Buah", price: 7000 },
    { name: "Gorengan", price: 3000 },
    { name: "Bubur Sumsum", price: 6000 },
    { name: "Kurma", price: 4000 },
    { name: "Cendol", price: 6500 }
];

// Fungsi membaca & menyimpan data pengguna
const readData = () => {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
};

const saveData = (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user = m.sender;
    let users = readData();

    if (!users[user]) users[user] = { takjil: {}, lastHunt: 0, balance: 0 };

    let now = Date.now();
    
    if (command === 'berburutakjil') {
        if (now - users[user].lastHunt < 3 * 60 * 60 * 1000) {
            let remaining = ((3 * 60 * 60 * 1000) - (now - users[user].lastHunt)) / 1000;
            throw `⏳ Kamu sudah berburu! Coba lagi dalam ${Math.ceil(remaining / 60)} menit.`;
        }
        
        let takjil = takjilList[Math.floor(Math.random() * takjilList.length)];
        users[user].takjil[takjil.name] = (users[user].takjil[takjil.name] || 0) + 1;
        users[user].lastHunt = now;
        saveData(users);

        m.reply(`🎉 Kamu mendapatkan **${takjil.name}** untuk berbuka puasa!`);
    }

    if (command === 'daftartakjil') {
        let takjilData = users[user].takjil;
        if (Object.keys(takjilData).length === 0) return m.reply(`❌ Kamu belum memiliki takjil.`);

        let list = Object.entries(takjilData).map(([takjil, jumlah]) => `🍽 ${takjil} x${jumlah}`).join('\n');
        m.reply(`📜 **Daftar Takjil Kamu:**\n${list}`);
    }

    if (command === 'jualtakjil') {
        if (!text) return m.reply(`❌ Gunakan: *${usedPrefix}jualtakjil <nama takjil>*\nContoh: *${usedPrefix}jualtakjil Kolak Pisang*`);

        let takjil = takjilList.find(t => t.name.toLowerCase() === text.toLowerCase());
        if (!takjil) return m.reply(`❌ Takjil tidak ditemukan!`);

        if (!users[user].takjil[takjil.name] || users[user].takjil[takjil.name] <= 0) return m.reply(`❌ Kamu tidak memiliki ${takjil.name}!`);

        users[user].takjil[takjil.name]--;
        if (users[user].takjil[takjil.name] === 0) delete users[user].takjil[takjil.name];

        users[user].balance += takjil.price;
        saveData(users);

        m.reply(`💰 Kamu menjual **${takjil.name}** seharga **Rp${takjil.price.toLocaleString()}**!`);
    }
};

handler.help = ['berburutakjil', 'daftartakjil', 'jualtakjil <nama>'];
handler.tags = ['game'];
handler.command = /^(berburutakjil|daftartakjil|jualtakjil)$/i;
handler.limit = true;

module.exports = handler;