let handler = async (m, { conn, args }) => {
    try {
        // Ambil ID grup dari pesan atau dari argumen
        let chat = m.chat;
        if (!chat.endsWith('@g.us')) {
            return conn.sendMessage(m.chat, { text: 'Perintah ini hanya bisa digunakan di grup!' }, { quoted: m });
        }

        // Ambil foto profil grup
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(chat, 'image');
        } catch (err) {
            ppUrl = 'https://telegra.ph/file/5d12976f6d4f36a7025a4.jpg'; // Gambar default jika tidak ada PP grup
        }

        // Kirim gambar ke pengguna
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: `🖼️ *Foto Profil Grup*`,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(m.chat, { text: `Terjadi kesalahan: ${error.message || 'Gagal mengambil foto profil grup'}` }, { quoted: m });
    }
};

// Menentukan perintah yang tersedia
handler.help = ['getppgc'];
handler.tags = ['group'];
handler.command = ['getppgc'];

module.exports = handler;