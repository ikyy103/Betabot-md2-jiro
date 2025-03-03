let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) throw "❌ Perintah ini hanya dapat digunakan oleh owner.";

    // Ambil data pengguna dari database
    let users = Object.entries(global.db.data.users);
    let unregisteredUsers = users.filter(([id, user]) => !user.registered);

    if (unregisteredUsers.length === 0) {
        return m.reply("✅ Tidak ada pengguna yang tidak terdaftar di database.");
    }

    // Hapus pengguna yang tidak terdaftar
    unregisteredUsers.forEach(([id]) => {
        delete global.db.data.users[id];
    });

    m.reply(`✅ Berhasil menghapus ${unregisteredUsers.length} pengguna yang tidak terdaftar dari database.`);
};

handler.help = ['clearunregistered'];
handler.tags = ['owner'];
handler.command = /^clearunregistered$/i;

handler.owner = true;

module.exports = handler;