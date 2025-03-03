let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let result = [];

    for (let user in users) {
        if (users[user].nilai && users[user].nilai.length > 0) {
            let lastRating = users[user].nilai[0]; // Ambil hanya satu nilai terakhir
            result.push(`@${user.split('@')[0]} - Nilai: ${lastRating}`);
        }
    }

    if (result.length === 0) {
        m.reply('Belum ada nilai yang diberikan.');
    } else {
        m.reply(`Daftar nilai:\n\n${result.join('\n')}`, null, {
            mentions: result.map(res => res.split(' - ')[0] + '@s.whatsapp.net')
        });
    }
};

handler.help = ['listnilai'];
handler.tags = ['info','rpg'];
handler.command = /^listnilai$/i;
module.exports = handler;