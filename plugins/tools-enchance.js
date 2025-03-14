const axios = require("axios");
const Telegraph = require("../lib/upload"); 

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime || !mime.startsWith("image/")) {
        return m.reply("⚠️ *Balas dengan gambar yang ingin diperbesar resolusinya!*");
    }

    let media = await q.download();
    let filePath = "./tmp/" + new Date().getTime() + ".jpg";
    require("fs").writeFileSync(filePath, media);

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key },
        });

        let upload = await Telegraph(filePath);
        if (upload.error) throw new Error(upload.error);

        let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/imgenlarger?url=${encodeURIComponent(upload.uploadedLinks[0])}`;
        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: "🔹 *Berhasil meningkatkan resolusi gambar!*",
        });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
        });

    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Coba lagi nanti.*");
    } finally {
        require("fs").unlinkSync(filePath);
    }
};

handler.help = ["enhance"];
handler.tags = ["tools"];
handler.command = ["enhance", "imgupscale"];

module.exports = handler;