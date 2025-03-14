const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const Telegraph = async (path) => {
  try {
    let formData = new FormData();
    formData.append("images", fs.createReadStream(path));

    let headers = {
      headers: {
        ...formData.getHeaders(),
      },
    };

    let { data: uploads } = await axios.post(
      "https://telegraph.zorner.men/upload",
      formData,
      headers
    );

    return uploads.links[0];
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`⚠️ *Gunakan format:* \n${usedPrefix + command} <hairstyle>\n\nContoh: \n${usedPrefix + command} Long curly hair`);
    }

    let hairstyle = encodeURIComponent(args.join(" "));

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

        let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/hairstylechanger?imageUrl=${encodeURIComponent(imageUrl)}&prompt=${hairstyle}`;
        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(m.chat, { image: response.data, caption: `💇 *Gaya rambut berhasil diubah!*\n\n✨ *Gaya Rambut:* ${args.join(" ")}` });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Coba lagi nanti.*");
    }
};

handler.help = ["hairstyle"];
handler.tags = ["tools"];
handler.command = ["hairstyle", "changerambut"];
handler.limit = 1;

module.exports = handler;