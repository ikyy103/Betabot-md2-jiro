const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Periksa apakah pengguna memberikan input teks
    if (!args[0]) throw `Contoh penggunaan:\n${usedPrefix}${command} hai`;

    // Gabungkan teks dari argumen
    const query = args.join(' ');

    try {
        // Panggil API dengan input teks
        const response = await fetch(`https://api.siputzx.my.id/api/ai/joko?content=${encodeURIComponent(query)}`);
        const json = await response.json();

        // Periksa apakah API mengembalikan hasil
        if (!json || !json.response) throw 'Maaf, terjadi kesalahan atau API tidak merespon.';

        // Kirimkan respon API ke pengguna
        m.reply(json.response);
    } catch (e) {
        console.error(e);
        m.reply('Maaf, terjadi kesalahan saat memproses permintaan Anda.');
    }
};

handler.help = ['joko <teks>'];
handler.tags = ['ai'];
handler.command = /^(joko)$/i;

module.exports = handler;