let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`⚠️ Balas media dengan perintah *${usedPrefix + command}* untuk mengirimnya sebagai ViewOnce.`);
    
    try {
        let mime = m.quoted.mimetype || "";
        let media = await m.quoted.download();
        
        if (!media) throw "⚠️ Gagal mengunduh media.";
        
        let type = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : mime.startsWith("audio/") ? "audio" : null;
        if (!type) throw "⚠️ Format media tidak didukung!";
        
        let options = { viewOnce: true };
        
        if (type === "image") {
            await conn.sendMessage(m.chat, { image: media, caption: "*🖼️ ViewOnce Image*", ...options }, { quoted: m });
        } else if (type === "video") {
            await conn.sendMessage(m.chat, { video: media, caption: "*🎥 ViewOnce Video*", ...options }, { quoted: m });
        } else if (type === "audio") {
            await conn.sendMessage(m.chat, { audio: media, mimetype: "audio/mpeg", ...options }, { quoted: m });
        } 
        
        m.reply("✅ *Media berhasil dikirim sebagai ViewOnce!*");
    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mengirim media sebagai ViewOnce!");
    }
};

handler.help = ["sendviewonce"];
handler.tags = ["tools"];
handler.command = ["sendviewonce", "svo", "viewoncemedia"];

module.exports = handler;