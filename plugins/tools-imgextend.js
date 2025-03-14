const axios = require("axios");

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 4) {
        return m.reply(`⚠️ *Gunakan format:* \n${usedPrefix + command} <left> <right> <top> <bottom>\n\nContoh: \n${usedPrefix + command} 150 150 150 150`);
    }

    let left = parseInt(args[0]);
    let right = parseInt(args[1]);
    let top = parseInt(args[2]);
    let bottom = parseInt(args[3]);

    if ([left, right, top, bottom].some(n => isNaN(n) || n < 0 || n > 300)) {
        return m.reply("❌ *Nilai harus antara 0 - 300!*\nContoh: `.imgextend 150 150 150 150`");
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime || !mime.startsWith("image/")) {
        return m.reply(" *Format tidak valid!* Balas dengan media gambar yang valid.");
    }

    let media = await q.download();
    let filePath = "./tmp/" + new Date().getTime() + ".jpg";

    fs.writeFileSync(filePath, media);

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        let imageUrl = await Telegraph(filePath);
        if (!imageUrl) throw new Error("Gagal mengunggah gambar.");

        let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/imgextender?imageUrl=${encodeURIComponent(imageUrl)}&left=${left}&right=${right}&top=${top}&bottom=${bottom}`;
        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(m.chat, { image: response.data, caption: `📏 *Gambar berhasil diperluas!*\n\n🔹 *Left:* ${left} px\n🔹 *Right:* ${right} px\n🔹 *Top:* ${top} px\n🔹 *Bottom:* ${bottom} px` });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Coba lagi nanti.*");
    }
};

handler.help = ["imgextend"];
handler.tags = ["tools"];
handler.command = ["imgextend", "imagextender"];
handler.limit = 1;

module.exports = handler;