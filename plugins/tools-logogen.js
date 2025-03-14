const axios = require("axios");

let industries = ["Construction", "Education", "Beauty Spa", "Automotive", "Animals Pets", "Travel", "Sports Fitness", "Retail", "Religious", "Real Estate", "Legal, Internet", "Technology", "Home Family", "Medical Dental", "Restaurant", "Finance", "Nonprofit", "Entertainment",];
let styles = ["Minimalist", "3D", "Hand-drawn", "Letter", "Badge", "Stamp", "Classic"];

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 3) {
        return m.reply(
            `× *Gunakan format:*\n${usedPrefix + command} <brand_name> | <deskripsi> | <nomor_industri> | <nomor_gaya>\n\n🛠 *Pilihan Industri:*\n${industries.map((v, i) => `${i + 1}. ${v}`).join("\n")}\n\n🎭 *Pilihan Gaya:*\n${styles.map((v, i) => `${i + 1}. ${v}`).join("\n")}\n\n📌 *Contoh:* \n${usedPrefix + command} TechInnovators | Logo modern | 1 | 1`
        );
    }

    let input = args.join(" ").split("|").map(v => v.trim());

    if (input.length < 4) {
        return m.reply("× *Format input tidak lengkap! Gunakan format yang benar.*");
    }

    let brandName = encodeURIComponent(input[0]);
    let prompt = encodeURIComponent(input[1]);
    let industryIndex = parseInt(input[2]) - 1;
    let styleIndex = parseInt(input[3]) - 1;

    if (isNaN(industryIndex) || industryIndex < 0 || industryIndex >= industries.length) {
        return m.reply("× *Nomor industri tidak valid! Pilih angka dari daftar industri.*");
    }
    if (isNaN(styleIndex) || styleIndex < 0 || styleIndex >= styles.length) {
        return m.reply("× *Nomor gaya tidak valid! Pilih angka dari daftar gaya.*");
    }

    let industry = encodeURIComponent(industries[industryIndex]);
    let style = encodeURIComponent(styles[styleIndex]);

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/logogenerator?brandname=${brandName}&prompt=${prompt}&industry=${industry}&style=${style}`;

    try {
        await conn.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });

        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        if (!response || !response.data) {
            return m.reply("❌ *Gagal mendapatkan gambar. Coba lagi nanti.*");
        }

        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Logo berhasil dibuat!*\n\n🏷 *Brand:* ${input[0]}\n🛠 *Industri:* ${industries[industryIndex]}\n🎭 *Gaya:* ${styles[styleIndex]}`,
        });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply("❌ *Terjadi kesalahan! Pastikan API aktif dan coba lagi nanti.*");
    }
};

handler.help = ["logogen"];
handler.tags = ["tools"];
handler.command = ["logogen", "makelogo", "logoai"];
handler.limit = 1;

module.exports = handler;