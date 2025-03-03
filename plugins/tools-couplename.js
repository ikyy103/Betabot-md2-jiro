const axios = require("axios");
const cheerio = require("cheerio");

let handler = async (m, { text }) => {
    try {
        // Validasi input
        if (!text) throw "❌ Masukkan nama pasangan (contoh: John dan Jane)";
        let [name1, name2] = text.split(" dan ");
        if (!name1 || !name2) throw "❌ Format salah! Gunakan format: Nama1 dan Nama2";

        // Kirim permintaan ke situs Name Generator
        const response = await axios.post(
            "https://www.name-generator.org.uk/couple/",
            new URLSearchParams({
                "name1": name1.trim(),
                "name2": name2.trim(),
                "generate": "Generate Couple Names"
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        // Parsing data menggunakan Cheerio
        const $ = cheerio.load(response.data);
        let coupleNames = [];
        $(".name_heading").each((i, el) => {
            coupleNames.push($(el).text().trim());
        });

        // Validasi hasil parsing
        if (coupleNames.length === 0) throw "❌ Tidak dapat menemukan nama pasangan.";

        // Kirim hasil ke pengguna
        m.reply(`✅ Nama pasangan yang dihasilkan:\n\n${coupleNames.map((name, i) => `${i + 1}. ${name}`).join("\n")}`);
    } catch (err) {
        console.error(err);
        m.reply(`❌ Terjadi kesalahan: ${err.message || err}`);
    }
};

handler.help = ["couplename"];
handler.tags = ["tools"];
handler.command = /^(couplename|namapasangan)$/i;

module.exports = handler;