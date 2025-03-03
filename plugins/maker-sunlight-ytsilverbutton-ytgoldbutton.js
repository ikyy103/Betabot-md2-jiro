let axios = require('axios');
let fs = require('fs');

let handler = async (m, { conn, args, command }) => {
    if (!args[0]) return m.reply(`Masukkan teks yang ingin digunakan!\n\nContoh:\n!sunlight Beta\n!ytsilverbutton Beta\n!ytgoldbutton Beta`);

    let text = args.join(' ');
    let apiUrl;

    // Pilih API berdasarkan command
    switch (command) {
        case 'sunlight':
            apiUrl = `https://api.betabotz.eu.org/api/ephoto/sunlight?text=${encodeURIComponent(text)}&apikey=btzSatriaop`;
            break;
        case 'ytsilverbutton':
            apiUrl = `https://api.betabotz.eu.org/api/ephoto/ytsilverbutton?text=${encodeURIComponent(text)}&apikey=btzSatriaop`;
            break;
        case 'ytgoldbutton':
            apiUrl = `https://api.betabotz.eu.org/api/ephoto/ytgoldbutton?text=${encodeURIComponent(text)}&apikey=btzSatriaop`;
            break;
        default:
            return m.reply('Command tidak valid!');
    }

    try {
        let res = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Simpan hasil gambar sementara
        let filename = `ephoto-${command}-${Date.now()}.jpg`;
        fs.writeFileSync(filename, res.data);

        // Kirim hasil ke pengguna
        await conn.sendMessage(m.chat, { image: { url: filename }, caption: `Berhasil membuat desain dengan teks: *${text}*` }, { quoted: m });

        // Hapus file sementara
        fs.unlinkSync(filename);
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat mengakses API. Coba lagi nanti.');
    }
};

handler.help = ['sunlight <teks>', 'ytsilverbutton <teks>', 'ytgoldbutton <teks>'];
handler.tags = ['ephoto','maker','tools'];
handler.command = /^(sunlight|ytsilverbutton|ytgoldbutton)$/i;

module.exports = handler;