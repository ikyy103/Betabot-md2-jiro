const axios = require('axios');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nama masakan!\n\nContoh: ${usedPrefix + command} ayam goreng`;

    let apiUrl = `https://api.siputzx.my.id/api/s/resep?query=${encodeURIComponent(text)}`;

    try {
        let response = await axios.get(apiUrl);
        if (!response.data || response.data.data === 0) throw '❌ Tidak ditemukan resep untuk pencarian tersebut.';

        let resep = response.data[0]; // Ambil hasil teratas
        let { title, waktu_masak, hasil, tingkat_kesulitan, bahan, cara, thumb } = resep;

        let caption = `
🍴 *Resep: ${title}*

⏳ *waktu masak :* ${waktu_masak.joim('\n')} 

*Hasil*: ${hasil.join('\n')}

*📊 tingkat kesulitan :* ${tingkat_kesulitan.join('\n')}

📋 *Bahan-Bahan:*
${bahan.join('\n')}

🍳 *Cara Membuat:*
${cara.join('\n')}
`.trim();

        if (thumb) {
            // Kirim gambar jika ada thumbnail
            await conn.sendFile(m.chat, thumb, 'resep.jpg', caption, m);
        } else {
            // Kirim teks saja jika tidak ada thumbnail
            m.reply(caption);
        }
    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat mengambil data. Pastikan API berjalan dengan baik.');
    }
};

handler.help = ['reseps <nama masakan>'];
handler.tags = ['internet'];
handler.command = /^reseps$/i;

module.exports = handler;