const orders = [
    'nasi goreng', 'ayam bakar', 'mie goreng', 'nasi uduk',
    'sate', 'bakso', 'soto', 'gado-gado'
];

const wartegs = {};
const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to get a random value in the range [min, max]
function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { conn }) => {
    let command = m.text.split(' ')[0].toLowerCase();
    let user = m.sender;
    let chatId = m.chat;

    // Ensure wartegs[chatId] exists
    if (!wartegs[chatId]) {
        wartegs[chatId] = {};
    }

    // Ensure wartegs[chatId][user] exists
    if (!wartegs[chatId][user]) {
        wartegs[chatId][user] = {
            isOpen: false,
            currentOrder: null,
            money: 0,
            exp: 0,
            common: [],
            uncommon: [],
            customerCount: 0,
            timer: null,
            interval: null
        };
    }

    // Ensure global.db.data.users[user] exists
    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            money: 0,
            exp: 0,
            common: 0,
            uncommon: 0,
            lastClosed: 0
        };
    }

    const newCustomer = () => {
        if (!wartegs[chatId][user].isOpen) return;
        let order = orders[Math.floor(Math.random() * orders.length)];
        wartegs[chatId][user].currentOrder = order;

        conn.reply(chatId, `⟣───「 *PESANAN* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${wartegs[chatId][user].customerCount + 1}/5 ]
 │📝 [ *Makanan* : ${order} ]
⟣──────────⟢

Ketik .pesanan <makanan>`, { mentions: [user] });

        wartegs[chatId][user].timer = setTimeout(() => {
            if (wartegs[chatId][user].isOpen && wartegs[chatId][user].currentOrder) {
                conn.reply(chatId, `Info @${user.replace(/@.+/, '')}, Warteg kamu tutup karena tidak melayani pelanggan tepat waktu.`, { mentions: [user] });
                clearInterval(wartegs[chatId][user].interval);
                wartegs[chatId][user].isOpen = false;
                wartegs[chatId][user].currentOrder = null;
                wartegs[chatId][user].customerCount = 0;
                global.db.data.users[user].lastClosed = Date.now();
            }
        }, 3 * 60 * 1000); // 3 minutes
    };

    if (command === '.warteg') {
        if (wartegs[chatId][user].isOpen) {
            conn.reply(chatId, `Hey @${user.replace(/@.+/, '')}, Warteg kamu masih buka. Silakan layani pelanggan.`, { mentions: [user] });
            return;
        }

        let currentTime = Date.now();
        if (currentTime - global.db.data.users[user].lastClosed < cooldown) {
            let remainingTime = cooldown - (currentTime - global.db.data.users[user].lastClosed);
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah melayani pelanggan seharian, istirahatlah sejenak\n${Math.ceil(remainingTime / 60000)} menit lagi.`, { mentions: [user] });

            // Set a timeout to notify the user when the cooldown period is over
            setTimeout(() => {
                conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah bisa buka warteg lagi! Ketik .warteg untuk memulai.`, { mentions: [user] });
            }, remainingTime);
            return;
        }

        wartegs[chatId][user].isOpen = true;
        wartegs[chatId][user].customerCount = 0;
        conn.reply(chatId, 'Warteg dibuka! Siap-siap melayani pelanggan setiap 3 menit.\n\nKetik .tutup untuk mengakhiri permainan', { mentions: [user] });

        newCustomer();
        wartegs[chatId][user].interval = setInterval(() => {
            if (wartegs[chatId][user].isOpen) {
                newCustomer();
            }
        }, 3 * 60 * 1000);

    } else if (command === '.pesanan') {
        if (!wartegs[chatId][user].isOpen) {
            conn.reply(chatId, `Aduh @${user.replace(/@.+/, '')}, Warteg kamu belum buka. Ketik .warteg untuk mulai`, { mentions: [user] });
            return;
        }

        if (!wartegs[chatId][user].currentOrder) {
            conn.reply(chatId, `Sabar @${user.replace(/@.+/, '')}, Tidak ada pelanggan saat ini. Tunggu pelanggan baru datang.`, { mentions: [user] });
            return;
        }

        let userOrder = m.text.split(' ').slice(1).join(' ').trim().toLowerCase();
        if (!userOrder) {
            conn.reply(chatId, 'Kamu harus menyertakan nama makanan setelah .pesanan.', { mentions: [user] });
            return;
        }

        let rewardmoney = 0;
        let rewardExp = 0;
        let rewardUncommon = 0;
        let rewardCommon = 0;

        if (userOrder === wartegs[chatId][user].currentOrder) {
            rewardmoney = getRandomReward(10000, 200000);
            rewardExp = getRandomReward(1000, 9999);
            rewardCommon = getRandomReward(100, 120);
            rewardUncommon = getRandomReward(100, 120);
            wartegs[chatId][user].customerCount++;
        } else {
            rewardmoney = getRandomReward(-2100000, -100000);
            rewardExp = 0;
        }

        wartegs[chatId][user].currentOrder = null;

        let message = `⟣───「 *STATISTIK* 」───⟢
 │🧑🏻‍🍳 Player: @${user.replace(/@.+/, '')}
 │📜 Pesanan Ke: ${wartegs[chatId][user].customerCount}/5
 │🏪 Info: Pesanan ${userOrder} ${rewardmoney < 0 ? 'salah' : 'dilayani'}
⟣──────────⟢`;

        conn.reply(chatId, message, { mentions: [user] });

        // Close warteg if customer count reaches limit
        if (wartegs[chatId][user].customerCount >= 5) {
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Warteg kamu tutup setelah melayani 5 pelanggan.`, { mentions: [user] });
            clearInterval(wartegs[chatId][user].interval);
        }
    }
};

handler.help = ['warteg', 'pesanan <makanan>', 'tutup'];
handler.tags = ['game', 'rpg'];
handler.command = /^(warteg|pesanan|tutup)$/i;
handler.group = true;

module.exports = handler;