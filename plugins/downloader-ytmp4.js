const axios = require('axios');

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

async function cekProgress(id) {
    const configProgress = {
        method: 'GET',
        url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest',
        },
    };

    while (true) {
        const response = await axios.request(configProgress);
        if (response.data && response.data.success && response.data.progress === 1000) {
            return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay 5 detik sebelum cek ulang
    }
}

async function ytdlv2(url, format) {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
        throw new Error('Format tidak valid. Gunakan format yang benar.');
    }

    const configDownload = {
        method: 'GET',
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest',
        },
    };

    const response = await axios.request(configDownload);

    if (response.data && response.data.success) {
        const { id, title } = response.data;

        const downloadUrl = await cekProgress(id);

        const videoBuffer = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

        return {
            title: title,
            buffer: videoBuffer.data,
        };
    } else {
        throw new Error('Gagal memproses video. Pastikan URL valid.');
    }
}

let handler = async (m, { conn, text, command }) => {
    if (!text || typeof text !== 'string' || !/^https?:\/\//.test(text)) {
        return m.reply(`Contoh penggunaan:\n${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
    }

    try {
        m.reply('Proses sedang berlangsung, mohon tunggu...');
        const result = await ytdlv2(text, '1440'); // Format video default: 1440
        await conn.sendMessage(m.chat, { video: result.buffer, caption: `*${result.title}*` }, { quoted: m });
    } catch (err) {
        console.error(err);
        m.reply('Terjadi kesalahan: ' + (err.message || 'Tidak diketahui.'));
    }
};

handler.command = ['ytmp4'];
handler.tags = ['downloader'];
handler.help = ['ytmp4 <link>'];
module.exports = handler;