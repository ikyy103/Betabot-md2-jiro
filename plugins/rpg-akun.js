let handler = async (m, { conn, command, args, usedPrefix }) => {
    try {
        const user = global.db.data.users[m.sender];
        const tag = '@' + m.sender.split('@')[0];
        let platform = command.split('akun')[1]; // Mendapatkan platform dari perintah

        // Fungsi untuk format angka
        function formatNumber(number) {
            if (number >= 1000000) {
                return (number / 1000000).toFixed(1) + 'Jt';
            } else if (number >= 1000) {
                return (number / 1000).toFixed(1) + 'K';
            } else {
                return number;
            }
        }

        if (command.startsWith('akun')) {
            let platformKey = `${platform}_account`;
            let followersKey = `${platform}_followers`;
            let postsKey = `${platform}_posts`;
            
            if (!user[platformKey]) {
                return conn.sendMessage(m.chat, { 
                    text: `Hey ${tag}, buat akun ${platform.toUpperCase()} terlebih dahulu\nKetik: ${usedPrefix}createakun${platform}`, 
                    contextInfo: { mentionedJid: [m.sender] }
                }, { quoted: m });
            }

            const formattedFollowers = formatNumber(user[followersKey] || 0);
            const formattedPosts = formatNumber(user[postsKey] || 0);

            return conn.sendMessage(m.chat, { 
                text: `📱 Akun ${platform.toUpperCase()} ${tag} 📈\n
🧑🏻‍💻 *Username:* ${user[platformKey]}
👥 *Followers:* ${formattedFollowers}
📄 *Posts:* ${formattedPosts}`, 
                contextInfo: { mentionedJid: [m.sender] }
            }, { quoted: m });
        }
    } catch (err) {
        console.error(err);
        return m.reply("Terjadi kesalahan dalam memproses perintah.");
    }
};

handler.command = /^akun(ig|tiktok|fb|discord)$/i; // Untuk cek akun semua platform
handler.help = ['akunig', 'akuntiktok', 'akunfb', 'akundiscord'];
handler.tags = ['rpg'];
handler.register = true;
handler.group = true;
module.exports = handler;