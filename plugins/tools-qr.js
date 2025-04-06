const fetch = require('node-fetch');

function detectQRType(text) {
    if (/^https?:\/\/\S+$/i.test(text)) return 'link';
    if (/^BEGIN:VCARD/i.test(text)) return 'vcard';
    if (/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(text)) return 'email';
    if (/^\+?\d{8,15}$/.test(text)) return 'phone';
    if (/^SMSTO:/i.test(text)) return 'sms';
    if (/^WIFI:/i.test(text)) return 'wifi';
    return 'text';
}

let handler = async (m, { conn, args, quoted, text }) => {
    let inputText = text || (quoted && (quoted.text || quoted.caption));
    if (!inputText) {
        return conn.reply(m.chat, `Kirim atau reply teks/link/email/nomor untuk dibuat QR.\nContoh: .qr https://google.com`, m);
    }

    let qrType = detectQRType(inputText);

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/qr/generator?data=${encodeURIComponent(inputText)}&type=${qrType}&background=255,255,255&foreground=0,0,0`;
        const buffer = await fetch(apiUrl).then(res => res.buffer());

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `✅ QR Code berhasil dibuat!\n\n• *Tipe Deteksi:* ${qrType}\n• *Data:* ${inputText}`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, 'Terjadi kesalahan saat mengambil QR Code.', m);
    }
};

handler.help = ['qr <teks/link> (atau reply pesan)'];
handler.tags = ['tools'];
handler.command = /^qr$/i;
handler.limit = true;

module.exports = handler;