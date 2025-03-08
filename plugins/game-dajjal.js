let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender];
    let mission = args[0]?.toLowerCase();

    if (!mission) {
        return conn.reply(m.chat, `
🌌 *Misi Pemburu Dajjal* 🌌
Pilih misi yang ingin kamu jalankan:
1️⃣ *pengikut* - Melawan pengikut Dajjal.
2️⃣ *petunjuk* - Mencari petunjuk lokasi Dajjal.
3️⃣ *final* - Bertarung melawan Dajjal.
📜 Gunakan: .dajjal <misi>
        `.trim(), m);
    }

    if (mission === 'pengikut') {
        let reward = Math.floor(Math.random() * 1000) + 500;
        user.exp += reward;
        return conn.reply(m.chat, `
🚨 *Misi Selesai: Melawan Pengikut Dajjal* 🚨
✨ Kamu berhasil melawan pengikut Dajjal!
🏅 Hadiah: ${reward} XP
        `.trim(), m);
    } else if (mission === 'petunjuk') {
        let clue = ["Lokasi di hutan", "Berada di lembah", "Di bawah tanah"];
        return conn.reply(m.chat, `
🔎 *Petunjuk Ditemukan* 🔎
📍 Lokasi: ${clue[Math.floor(Math.random() * clue.length)]}
        `.trim(), m);
    } else if (mission === 'final') {
        let success = Math.random() > 0.5;
        if (success) {
            user.exp += 5000;
            return conn.reply(m.chat, `
🎉 *Kemenangan* 🎉
Kamu berhasil mengalahkan Dajjal!
🏅 Hadiah: 5000 XP
        `.trim(), m);
        } else {
            return conn.reply(m.chat, `
❌ *Kekalahan* ❌
Dajjal terlalu kuat! Coba lagi setelah meningkatkan kemampuanmu.
        `.trim(), m);
        }
    } else {
        return conn.reply(m.chat, '❌ Misi tidak valid!', m);
    }
};

handler.command = /^(dajjal)$/i;
handler.tags = ['game'];
handler.help = ['dajjal <misi>'];

module.exports = handler;