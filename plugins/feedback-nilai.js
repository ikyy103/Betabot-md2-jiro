let handler = async (m, { conn, text }) => {
    let user = m.sender;
    let users = global.db.data.users;

    if (!users[user]) users[user] = { nilai: [], lastRating: 0 };
    let now = new Date().getTime();
    let threeDays = 3 * 24 * 60 * 60 * 1000;

    if (now - users[user].lastRating < threeDays) {
        let remainingTime = Math.ceil((threeDays - (now - users[user].lastRating)) / (1000 * 60 * 60 * 24));
        return m.reply(`Anda hanya dapat menilai sekali setiap 3 hari. Silakan coba lagi dalam ${remainingTime} hari.`);
    }

    // Validasi nilai yang diterima
    let rating = parseInt(text);
    if (isNaN(rating) || rating < 1 || rating > 10000000) {
        return m.reply('Silakan beri nilai antara 1-100.');
    }

    // Simpan nilai
    users[user].nilai = [rating]; // Hanya satu nilai disimpan per 3 hari
    users[user].lastRating = now;

    m.reply(`Terima kasih telah memberikan penilaian! Anda telah memberikan nilai: ${rating}`);
};

handler.help = ['nilai'];
handler.tags = ['feedback','rpg','tools'];
handler.command = /^nilai$/i;
module.exports = handler;