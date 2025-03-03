let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    let platform = command.replace('createakun', '').replace('deleteakun', '');

    try {
        if (command.startsWith('createakun')) {
            if (args.length === 0) {
                return m.reply(`Silakan masukkan nama akun ${platform.toUpperCase()} Anda.\nContoh: ${usedPrefix}createakun${platform} usernameAnda`);
            }

            let accountName = args.join(' '); // Nama akun
            let platformKey = `${platform}_account`;
            user[platformKey] = accountName;

            m.reply(`Akun ${platform.toUpperCase()} Anda berhasil dibuat/diedit\nusername: ${accountName}`);
        } else if (command.startsWith('deleteakun')) {
            let platformKey = `${platform}_account`;

            if (!user[platformKey]) {
                return m.reply(`Anda belum memiliki akun ${platform.toUpperCase()}.`);
            }

            delete user[platformKey];
            m.reply(`Akun ${platform.toUpperCase()} Anda telah dihapus.`);
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
};

handler.command = /^(createakunig|deleteakunig|createakuntiktok|deleteakuntiktok|createakunfb|deleteakunfb|createakundiscord|deleteakundiscord)$/i;
handler.help = ['createakunig', 'deleteakunig', 'createakuntiktok', 'deleteakuntiktok', 'createakunfb', 'deleteakunfb', 'createakundiscord', 'deleteakundiscord'];
handler.tags = ['rpg'];
handler.register = true;
handler.group = true;
module.exports = handler;