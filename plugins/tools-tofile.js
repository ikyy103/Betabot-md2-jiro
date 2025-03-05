const fs = require('fs');
const path = require('path');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} menu | js`, m);
    if (!m.quoted || !m.quoted.text) return conn.reply(m.chat, `🚩 Reply pesan teks yang ingin dijadikan file!`, m);

    try {
        let [fileName, fileFormat] = text.split('|').map(v => v.trim());

        if (!fileName || !fileFormat) return conn.reply(m.chat, `× Format salah!\n• *Example :* ${usedPrefix + command} menu | js`, m);

        let fullFileName = `${fileName}.${fileFormat}`;
        let filePath = path.join(__dirname, fullFileName);

        fs.writeFileSync(filePath, m.quoted.text);

        conn.reply(m.chat, `🚩 File berhasil dibuat: ${fullFileName}\n📩 Mengirim file...`, m);

conn.sendMessage(m.chat, { document: { url: filePath }, mimetype: 'text/plain', fileName: fullFileName }, { quoted: m });

        setTimeout(() => {
            fs.unlinkSync(filePath);
        }, 5000);

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, "❌ Terjadi kesalahan saat membuat atau mengirim file!", m);
    }
};

handler.help = ['tofile'];
handler.tags = ['tools'];
handler.command = ['tofile', 'tekstofile', 'texttofile'];

handler.owner = false;
module.exports = handler;