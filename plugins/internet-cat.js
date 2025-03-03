const axios = require('axios');

let handler = async (m, { conn }) => {
    try {
        // Memberitahu pengguna bahwa proses sedang berjalan
        m.reply('Mencari kucing lucu untukmu, tunggu sebentar...');

        // Mengakses API kucing random
        const response = await axios.get('https://api.siputzx.my.id/api/r/cats', {
            responseType: 'arraybuffer' // Mendapatkan data gambar langsung sebagai buffer
        });

        // Membuat nama file sementara
        const fileName = 'cat.jpg';

        // Mengirim gambar langsung dari buffer
        await conn.sendFile(m.chat, response.data, fileName, 'Inilah kucingmu, semoga suka! 🐱', m);
    } catch (err) {
        console.error(err);
        // Menampilkan pesan error kepada pengguna
        m.reply('Terjadi kesalahan saat mengambil gambar kucing. Coba lagi nanti. 😔');
    }
};

handler.command = ['cat']; // Command untuk memanggil fitur
handler.tags = ['internet']; // Kategori
handler.help = ['cat']; // Bantuan penggunaan command
handler.limit = 1;

module.exports = handler;