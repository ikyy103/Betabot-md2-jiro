let handler = async (m, { conn }) => {
    if (m.isGroup) return m.reply("❌ Command ini hanya bisa digunakan di chat pribadi!");
    
    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage) return m.reply("📌 Balas pesan gambar/video yang ingin diambil!");

    const mediaType = quotedMessage.imageMessage ? 'image' : quotedMessage.videoMessage ? 'video' : null;
    if (!mediaType) return m.reply("❌ Hanya bisa mengambil gambar atau video dari pesan yang dikutip!");

    const mediaUrl = await conn.downloadAndSaveMediaMessage(quotedMessage[`${mediaType}Message`]);
    return conn.sendMessage(m.chat, { [mediaType]: { url: mediaUrl } }, { quoted: m });
};

handler.help = ['ambilsw'];
handler.tags = ['media'];
handler.command = /^(ambilsw)$/i;
handler.limit = true;

module.exports = handler;