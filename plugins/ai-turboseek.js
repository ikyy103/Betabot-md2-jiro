const fetch = require("node-fetch");

let handler = async (m, { text }) => {
    if (!text) return m.reply("❌ *Masukkan pertanyaan untuk TurboSeek!*");

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/turboseek?ask=${encodeURIComponent(text)}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200) return m.reply("❌ *Terjadi kesalahan saat mengambil data!*");

        let answer = data.result.answer || "Jawaban tidak ditemukan.";
        let similarQuestions = data.result.similar_questions.length ? `❓ *Pertanyaan Terkait:* ${data.result.similar_questions.join(", ")}` : "Tidak ada pertanyaan terkait.";
        let sources = data.result.sources.map(s => `🌐 *${s.name}*: ${s.url}`).join("\n") || "Tidak ada sumber referensi.";

        let message = `🔍 *Hasil Pencarian TurboSeek:*\n${answer}\n\n${similarQuestions}\n\n${sources}`;
        m.reply(message);
    } catch (error) {
        console.error(error);
        m.reply("⚠️ *Gagal mengambil data, coba lagi nanti!*");
    }
};

handler.help = ["turboseek *<pertanyaan>*"];
handler.tags = ["ai"];
handler.command = /^turboseek$/i;

module.exports = handler;