const uploadFile = require('../lib/uploadFile');

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`⚠️ Balas voice note/audio dengan perintah *${usedPrefix + command}* untuk mengubahnya menjadi teks.`);
    
    try {
        let mime = m.quoted.mimetype || "";
        if (!mime.startsWith("audio/")) throw "⚠️ Format file tidak didukung! Hanya audio yang bisa dikonversi ke teks.";

        let media = await m.quoted.download();
        let fileSizeLimit = 10 * 1024 * 1024; // Maksimal 10MB
        if (media.length > fileSizeLimit) throw "⚠️ Ukuran file terlalu besar! Maksimal 10MB.";

        // Upload audio ke server file hosting
        let fileUrl = await uploadFile(media);
        if (!fileUrl) throw "⚠️ Gagal mengunggah audio!";

        // Kirim ke API BetaBotz untuk transkripsi
        let apiUrl = `https://api.betabotz.eu.org/api/search/bard-audio?url=${fileUrl}&text=berikan+transkripsi+dari+audio+tersebut?&apikey=beta-Satriaop`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data.status) throw "⚠️ Gagal mendapatkan transkripsi!";
        let textResult = data.result || "⚠️ Tidak ada teks yang terdeteksi.";

        m.reply(`🗣 *Hasil Transkripsi:*\n\n${textResult}`);

    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mengonversi audio ke teks!");
    }
};

handler.help = ["audiototext"];
handler.tags = ["tools"];
handler.command = ["audiototext", "att", "stt"];

module.exports = handler;