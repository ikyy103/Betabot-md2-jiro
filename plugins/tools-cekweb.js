const axios = require("axios");

let handler = async (m, { args }) => {
    if (args.length < 1) {
        return m.reply("⚠️ *Example:* .downchecker https://google.com");
    }

    let url = args[0].trim();
    if (!url.startsWith("http")) return m.reply("⚠️ URL tidak valid! Pastikan dimulai dengan http atau https.");

    m.reply("🔄 *Memeriksa status website...*");

    try {
        let response = await axios.get(`https://fastrestapis.fasturl.cloud/tool/downchecker?url=${encodeURIComponent(url)}`);
        let { status, content, result } = response.data;

        if (status !== 200) throw new Error("Gagal mendapatkan data dari API.");

        let message = `
🌐 *Status Website*
📌 *URL:* ${url}
✅ *Status:* ${content}
📝 *Keterangan:* 
${result}
        `.trim();

        m.reply(message);
    } catch (error) {
        console.error("❌ Error Down Checker:", error);
        m.reply("⚠️ Terjadi kesalahan saat memeriksa website!");
    }
};

handler.help = ["cekweb <𝚞𝚛𝚕>"]
handler.tags = ["tools", "internet"];
handler.command = /^downchecker|cekweb$/i;
handler.owner = false;
handler.limit = true;

module.exports = handler;