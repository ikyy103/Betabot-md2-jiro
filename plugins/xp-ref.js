const crypto = require('crypto');

const rewards = {
    xp_first_time: 2500, // XP untuk pengguna baru
    xp_link_creator: 15000, // XP untuk pembuat link
    limit_first_time: 5, // Limit untuk pengguna baru
    limit_link_creator: 10, // Limit untuk pembuat link
    money_first_time: 1000, // Money untuk pengguna baru
    money_link_creator: 5000, // Money untuk pembuat link
};

const xp_bonus = {
    5: 40000,
    10: 100000,
    20: 250000,
    50: 1000000,
    100: 10000000,
}; // Bonus XP untuk milestones

let handler = async (m, { conn, usedPrefix, text }) => {
    let users = global.db.data.users;

    if (text) {
        if ('ref_count' in users[m.sender]) throw '❌ Kamu sudah menggunakan kode referal sebelumnya!';

        let link_creator = (Object.entries(users).find(([, { ref_code }]) => ref_code === text.trim()) || [])[0];
        if (!link_creator) throw '❌ Kode referal tidak valid!';

        let count = users[link_creator].ref_count++;
        let extra = xp_bonus[count] || 0;

        // Tambahkan hadiah kepada pembuat referal
        users[link_creator].exp += rewards.xp_link_creator + extra;
        users[link_creator].limit += rewards.limit_link_creator;
        users[link_creator].money += rewards.money_link_creator;

        // Tambahkan hadiah kepada pengguna baru
        users[m.sender].exp += rewards.xp_first_time;
        users[m.sender].limit += rewards.limit_first_time;
        users[m.sender].money += rewards.money_first_time;
        users[m.sender].ref_count = 0;

        m.reply(`
✅ Selamat! Kamu mendapatkan hadiah:
+${rewards.xp_first_time} XP
+${rewards.limit_first_time} Limit
+${rewards.money_first_time} Money
`.trim());

        conn.reply(link_creator, `
📢 Seseorang telah menggunakan kode referal kamu! Kamu mendapatkan:
+${rewards.xp_link_creator + extra} XP
+${rewards.limit_link_creator} Limit
+${rewards.money_link_creator} Money
`.trim(), m);
    } else {
        let code = users[m.sender].ref_code = users[m.sender].ref_code || new Array(11).fill().map(() => [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'][crypto.randomInt(62)]).join('');
        users[m.sender].ref_count = users[m.sender].ref_count || 0;

        let command_text = `${usedPrefix}ref ${code}`;
        let command_link = `wa.me/${conn.user.jid.split('@')[0]}?text=${encodeURIComponent(command_text)}`;
        let share_text = `
Dapatkan hadiah dengan menggunakan kode referal di bawah ini!

Referal Code: *${code}*

${command_link}
`.trim();

        m.reply(`
🌟 *Referal System* 🌟

🧑🏻‍💻 Dapatkan *${rewards.xp_link_creator} XP*, *${rewards.limit_link_creator} Limit*, dan *${rewards.money_link_creator} Money* untuk setiap pengguna baru yang menggunakan kode referal kamu.
📊 *${users[m.sender].ref_count}* orang telah menggunakan kode referal kamu.

🔗 *Kode referal kamu:* ${code}
📩 *Bagikan link ini:* ${command_link}

📜 Kirim pesan ke teman: wa.me/?text=${encodeURIComponent(share_text)}

🎁 Bonus XP:
${Object.entries(xp_bonus).map(([count, xp]) => `• ${count} Orang = Bonus ${xp} XP`).join('\n')}
`.trim());
    }
};

handler.help = ['ref'];
handler.tags = ['main', 'xp'];
handler.command = ['ref'];
handler.register = true;

module.exports = handler;