const axios = require("axios");

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 3) {
        return m.reply(`⚠️ *Gunakan format:* \n${usedPrefix + command} <prompt> | <type> | <visualStyle> | <characterStyle>\n\nContoh: \n${usedPrefix + command} A woman in a futuristic outfit | Realistic | Covering breasts, Concept Pool Ladder | Realistic Doll V4`);
    }

    let input = args.join(" ").split("|").map(v => v.trim());
    let prompt = encodeURIComponent(input[0]);
    let type = encodeURIComponent(input[1]);
    let visualStyle = encodeURIComponent(input[2]);
    let characterStyle = encodeURIComponent(input[3]);

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/bodygenerator?prompt=${prompt}&type=${type}&visualStyle=${visualStyle}&characterStyle=${characterStyle}`;

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "🎨", key: m.key },
        });

        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `*berhasil dibuat!*\n\n🎭 *Prompt:* ${input[0]}\n🔹 *Tipe:* ${input[1]}\n🔹 *Visual Style:* ${input[2]}\n🔹 *Character Style:* ${input[3]}`,
        });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
        });

    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Coba lagi nanti.*");
    }
};

handler.help = ["bodygen"];
handler.tags = ["tools"];
handler.command = ["bodygen", "charagen", "generatebody"];
handler.limit = 1;

module.exports = handler;