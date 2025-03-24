const axios = require('axios');
const FormData = require('form-data');

let uploadFile = async (media) => {
    let fileSizeLimit = 15 * 1024 * 1024; // Maksimal 15MB

    if (media.length > fileSizeLimit) {
        throw '❌ Ukuran media tidak boleh melebihi 15MB!';
    }

    let form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', media, 'upload');

    try {
        let { data } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }
        });

        if (data.includes("https://files.catbox.moe")) {
            return data; // Mengembalikan URL file yang diunggah
        } else {
            throw '❌ Upload gagal, coba lagi nanti!';
        }
    } catch (e) {
        console.error(e);
        throw '❌ Terjadi kesalahan saat mengunggah file!';
    }
};

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`⚠️ Balas voice note/audio dengan perintah *${usedPrefix + command}* untuk mengubahnya menjadi teks.`);
    
    try {
        let mime = m.quoted.mimetype || "";
        // Memastikan format audio yang didukung
        if (!mime.startsWith("audio/") || (mime !== "audio/ogg" && !mime.includes("opus"))) {
            throw "⚠️ Format file tidak didukung! Hanya audio/ogg dan codec opus yang bisa dikonversi ke teks.";
        }

        let media = await m.quoted.download();
        let fileSizeLimit = 10 * 1024 * 1024; // Maksimal 10MB
        if (media.length > fileSizeLimit) throw "⚠️ Ukuran file terlalu besar! Maksimal 10MB.";

        // Upload audio ke server file hosting
        let fileUrl = await uploadFile(media);
        if (!fileUrl) throw "⚠️ Gagal mengunggah audio!";

        // Kirim ke API Fast Rest untuk transkripsi
        let apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/voicetotext?audioUrl=${encodeURIComponent(fileUrl)}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200) throw "⚠️ Gagal mendapatkan transkripsi!";
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