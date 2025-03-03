let axios = require('axios');

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw `❌ Masukkan teks untuk fitur ini.\n\nContoh: *${usedPrefix + command} Halo*`;

    let url;
    try {
        switch (command) {
            case 'joko':
                url = `https://api.siputzx.my.id/api/ai/joko?content=${encodeURIComponent(text)}`;
                break;
            case 'latukam':
                url = `https://api.siputzx.my.id/api/ai/latukam?content=${encodeURIComponent(text)}`;
                break;
            case 'metaai':
                url = `https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(text)}`;
                break;
            case 'yousearch':
                url = `https://api.siputzx.my.id/api/ai/yousearch?text=${encodeURIComponent(text)}`;
                break;
            case 'mistral':
                url = `https://api.siputzx.my.id/api/ai/mistral?prompt=You%20are%20an%20assistant%20that%20always%20responds%20in%20Indonesian%20with%20a%20friendly%20and%20informal%20tone&message=${encodeURIComponent(text)}`;
                break;
            case 'muslimai':
                url = `https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(text)}`;
                break;
            default:
                throw `❌ Perintah tidak dikenali. Gunakan: *${usedPrefix}joko, ${usedPrefix}latukam, ${usedPrefix}metaai, ${usedPrefix}mistral, ${usedPrefix}yousearch, atau ${usedPrefix}muslimai*.`;
        }

        let response = await axios.get(url);

        if (!response.data || !response.data.data) {
            throw '❌ Gagal mendapatkan respons dari API.';
        }

        m.reply(`${response.data.data}`);
    } catch (e) {
        console.error('Error:', e);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.');
    }
};

handler.command = ['joko', 'latukam', 'metaai', 'muslimai', 'mistral', 'yousearch'];
handler.help = ['joko <teks>', 'latukam <teks>', 'metaai <teks>', 'muslimai <teks>', 'mistral <teks>', 'yousearch <query>'];
handler.tags = ['ai'];

module.exports = handler;