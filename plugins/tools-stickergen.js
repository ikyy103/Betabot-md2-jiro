const axios = require("axios");

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`⚠️ *Gunakan format:* \n${usedPrefix + command} <prompt> | [imageUrl]\n\nContoh: \n${usedPrefix + command} A cute cat`);
    }

    let input = args.join(" ").split("|").map(v => v.trim());
    let prompt = encodeURIComponent(input[0]);
    let imageUrl = input[1] ? encodeURIComponent(input[1]) : "";

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/stickergenerator?prompt=${prompt}`;
    if (imageUrl) apiUrl += `&imageUrl=${imageUrl}`;

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key },
        });

        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(m.chat, {
            sticker: response.data,
        });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
        });

    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Coba lagi nanti.*");
    }
};

handler.help = ["stickerai"];
handler.tags = ["tools"];
handler.command = ["stickerai", "aisticker", "stickergen"];

module.exports = handler;