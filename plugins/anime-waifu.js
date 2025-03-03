const axios = require('axios');

let handler = async (m, { conn }) => {
    try {
        // Memberitahu pengguna bahwa proses sedang berjalan
        m.reply('Mencari waifu random terbaik untukmu, tunggu sebentar...');

        // Mengakses API waifu random
        const response = await axios.get('https://api.vreden.my.id/api/waifu', {
            responseType: 'arraybuffer' // Mendapatkan data gambar langsung sebagai buffer
        });

        // Membuat nama file sementara
        const fileName = 'waifu.jpg';

        // Mengirim gambar langsung dari buffer
        await conn.sendFile(m.chat, response.data, fileName, 'Inilah waifumu, semoga cocok!', m);
    } catch (err) {
        console.error(err);
        // Menampilkan pesan error kepada pengguna
        m.reply('Terjadi kesalahan saat mengambil gambar waifu. Coba lagi nanti.');
    }
};

handler.command = ['waifu']; // Command untuk memanggil fitur
handler.tags = ['anime']; // Kategori
handler.help = ['waifu']; // Bantuan penggunaan command
handler.limit = 1

module.exports = handler;