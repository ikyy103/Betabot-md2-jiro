const axios = require("axios");

let handler = async (m, { conn, text }) => {
    try {
        // Validasi input
        if (!text) throw "❌ Masukkan nama pasangan (contoh: John dan Jane)";
        let [name1, name2] = text.split(" dan ");
        if (!name1 || !name2) throw "❌ Format salah! Gunakan format: Nama1 dan Nama2";

        // Kirim permintaan ke API Name Generator
        let url = `https://www.name-generator.org.uk/couple/`;
        let response = await axios.get(url, {
            params: {
                name1,
                name2,
            },
        });

        // Parsing hasil
        let coupleNames = response.data; // Sesuaikan parsing sesuai hasil respons
        if (!coupleNames) throw "❌ Tidak dapat menghasilkan nama pasangan.";

        // Kirim hasil ke user
        m.reply(`✅ Nama pasangan yang dihasilkan: \n\n${coupleNames.join("\n")}`);
    } catch (err) {
        console.error(err);
        m.reply(`❌ Terjadi kesalahan: ${err.message}`);
    }
};

handler.help = ["couplename"];
handler.tags = ["tools"];
handler.command = /^(couplename|namapasangan)$/i;

module.exports = handler;