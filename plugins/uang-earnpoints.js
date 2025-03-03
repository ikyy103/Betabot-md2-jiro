const db = require('quick.db');

var handler = async (m, { command }) => {
    const points = Math.floor(Math.random() * 100) + 10; // Random point (10-100)
    
    db.add(`user_${m.sender}.points`, points);
    return m.reply(`🎉 Kamu mendapatkan ${points} poin! Terus gunakan bot untuk mendapatkan lebih banyak poin.`);
};

handler.command = ['earnpoints'];
handler.tags = ['reward'];
handler.help = ['earnpoints'];
module.exports = handler;