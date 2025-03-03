const fetch = require('node-fetch');

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('❌ *Pertanyaan tidak boleh kosong!*');

    const apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/alkitab?ask=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.status !== 200) throw new Error(`API error! Content: ${data.content}`);

        const { answer, bible, media } = data.result;

        let message = `*Jawaban:*\n${answer}\n\n`;

        if (bible && bible.length > 0) {
            message += '*Ayat Alkitab terkait:*\n';
            bible.forEach(verse => {
                message += `- ${verse.ref}: ${verse.text}\n`;
            });
            message += '\n';
        }

        if (media && media.length > 0) {
            message += '*Media terkait:*\n';
            media.forEach(item => {
                message += `- [${item.videoDetails.title}](${item.id})\n`;
            });
        }

        m.reply(message);
    } catch (error) {
        console.error('Error fetching data:', error);
        m.reply('❌ *Terjadi kesalahan saat mengambil data!*');
    }
};

handler.help = ['alkitab <pertanyaan>'];
handler.tags = ['religion'];
handler.command = /^alkitab$/i;

module.exports = handler;