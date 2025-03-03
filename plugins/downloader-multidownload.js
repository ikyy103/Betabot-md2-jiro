const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return m.reply(`⚠️ Masukkan URL yang ingin diunduh.\n\n📌 Contoh:\n${usedPrefix}multidownload <url>`);

    let url = args[0];

    // Cek dari mana sumber URL
    let apiUrl = '';
    if (url.includes('instagram.com')) {
        apiUrl = `https://api.betabotz.eu.org/api/download/igdowloader?url=${url}&apikey=Btz-Jirokw01`;
    } else if (url.includes('sfile.mobi')) {
        apiUrl = `https://api.betabotz.eu.org/api/download/sfilemobi?url=${url}&apikey=Btz-Jirokw01`;
    } else if (url.includes('terabox.app')) {
        apiUrl = `https://api.betabotz.eu.org/api/download/terabox?url=${url}&apikey=Btz-Jirokw01`;
    } else if (url.includes('videy.co')) {
        apiUrl = `https://api.betabotz.eu.org/api/download/videy?url=${url}&apikey=Btz-Jirokw01`;
    } else {
        apiUrl = `https://api.betabotz.eu.org/api/download/allin?url=${url}&apikey=Btz-Jirokw01`;
    }

    try {
        let res = await axios.get(apiUrl);
        let data = res.data;

        if (!data || !data.status) return m.reply('⚠️ Gagal mengambil data. Coba lagi nanti.');

        let caption = `✅ *Berhasil Mengunduh!*\n\n📌 *Judul:* ${data.result.title || 'Tidak Diketahui'}\n📥 *Ukuran:* ${data.result.size || 'Tidak Diketahui'}\n🌐 *Sumber:* ${url}`;

        // Kirim file berdasarkan jenisnya
        if (data.result.url) {
            let mediaType = data.result.url.includes('.mp4') ? 'video' : 'document';
            conn.sendMessage(m.chat, {
                [mediaType]: { url: data.result.url },
                caption
            }, { quoted: m });
        } else {
            m.reply(`⚠️ Gagal mengambil link download. Coba langsung di browser: ${data.result.url}`);
        }
    } catch (error) {
        console.error(error);
        m.reply('⚠️ Terjadi kesalahan saat mengunduh. Coba lagi nanti.');
    }
};

handler.help = ['multidownload <url>'];
handler.tags = ['downloader'];
handler.command = /^multidownload$/i;

module.exports = handler;