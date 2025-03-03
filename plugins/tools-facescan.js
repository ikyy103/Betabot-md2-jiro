const axios = require("axios");

let handler = async (m, { args }) => {
    let imageUrl = args[0];

    if (!imageUrl) return m.reply("⚠️ *Example:* .facescan https://example.com/image.jpg");

    m.reply("🔄 *Menganalisis wajah...*");

    try {
        let { data } = await axios.get(`https://fastrestapis.fasturl.cloud/aiexperience/facescan?imageUrl=${encodeURIComponent(imageUrl)}`);

        if (data.status === 200 && data.content === "Success") {
            let result = data.result;
            let message = `✅ *Hasil Analisis Wajah:*\n\n`;
            message += `👤 *Gender:* ${result.gender}\n`;
            message += `🎂 *Usia:* ${result.age}\n`;
            message += `💖 *Skor Kecantikan:* ${result.beautyScore}\n`;
            message += `😐 *Ekspresi:* ${result.expression}\n`;
            message += `🔶 *Bentuk Wajah:* ${result.faceShape}`;
            m.reply(message);
        } else {
            m.reply("⚠️ Gagal menganalisis wajah! Pastikan URL gambar valid.");
        }
    } catch (error) {
        console.error("❌ Error Face Scan:", error);
        m.reply("⚠️ Terjadi kesalahan saat menganalisis wajah!");
    }
};

handler.help = ["facescan *<url>*"]
handler.tags = ["tools"];
handler.command = /^facescan$/i;
handler.owner = false;
handler.limit = 3

module.exports = handler;