const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

let handler = async (m, { conn, usedPrefix }) => {
    if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) {
        return m.reply(`⚠️ Kirim atau balas gambar dengan perintah:\n\n*${usedPrefix}geospy*`);
    }

    try {
        let media = await m.quoted.download(); // Unduh gambar dari pesan
        let form = new FormData();
        form.append('file', media, { filename: 'image.jpg' });

        // Kirim gambar ke GeoSpy
        let uploadRes = await axios.post('https://geospy.net/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        let imageUrl = uploadRes.data.url; // URL gambar yang diunggah
        if (!imageUrl) return m.reply('⚠️ Gagal mengunggah gambar. Coba lagi nanti.');

        // Ambil hasil analisis lokasi
        let resultUrl = `https://geospy.net/result?image=${encodeURIComponent(imageUrl)}`;
        let resultRes = await axios.get(resultUrl);
        let resultData = resultRes.data; // Data hasil analisis

        // Parsing hasil yang relevan
        let description = resultData?.description || 'Tidak ada deskripsi tersedia.';
        let country = resultData?.country || 'Tidak diketahui';
        let state = resultData?.state || 'Tidak diketahui';
        let city = resultData?.city || 'Tidak diketahui';

        let responseText = `🌍 *GeoSpy Location Analysis* 🌍\n\n📷 *Deskripsi Foto:*\n${description}\n\n📍 *Lokasi Perkiraan:*\n🌎 Negara: ${country}\n🏛️ Provinsi/Negara Bagian: ${state}\n🏙️ Kota: ${city}\n\n🔗 [Lihat Hasil](<${resultUrl}>)`;

        m.reply(responseText);
    } catch (error) {
        console.error(error);
        m.reply('⚠️ Terjadi kesalahan saat memproses gambar. Coba lagi nanti.');
    }
};

handler.help = ['geospy'];
handler.tags = ['tools'];
handler.command = /^geospy$/i;

module.exports = handler;