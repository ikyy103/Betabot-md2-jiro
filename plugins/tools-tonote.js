const axios = require("axios");
const fs = require("fs");
const path = require("path");

let handler = async (m, { args }) => {
    if (args.length < 6) {
        return m.reply("⚠️ *Example:* .texttonote Hikaru, XII-BioA, Sexual Organs, 2025-01-25, The human reproductive system consists of..., png");
    }

    let [name, classroom, subject, date, ...rest] = args.join(" ").split(",");
    let content = rest.slice(0, -1).join(",").trim();
    let format = rest[rest.length - 1].trim() || "png";

    if (!name || !classroom || !subject || !date || !content) {
        return m.reply("⚠️ Pastikan semua parameter sudah diisi dengan benar!");
    }

    m.reply("🔄 *Mengubah teks menjadi catatan tulisan tangan...*");

    try {
        let { data } = await axios.get("https://fastrestapis.fasturl.cloud/tool/texttonote", {
            params: {
                name: name.trim(),
                classroom: classroom.trim(),
                subject: subject.trim(),
                date: date.trim(),
                content: content.trim(),
                font: "MyHandsareHoldingYou.ttf",
                format: format.trim(),
            },
            responseType: "arraybuffer",
        });

        if (data) {
            let filePath = path.join(__dirname, `catatan_${name.trim()}.${format.trim()}`);
            fs.writeFileSync(filePath, data);

            m.reply("✅ *Catatan berhasil dibuat! Mengirim gambar...*");
            conn.sendMessage(m.chat, { image: { url: filePath }, caption: `📝 *Catatan untuk ${name.trim()}*\n📚 *Mata Pelajaran:* ${subject.trim()}` });
        } else {
            m.reply("⚠️ Gagal membuat catatan! Coba lagi.");
        }
    } catch (error) {
        console.error("❌ Error Text to Note:", error);
        m.reply("⚠️ Terjadi kesalahan saat membuat catatan!");
    }
};

handler.help = ["tonote <Nama>, <Kelas>, <Mata Pelajaran> ,<Tanggal>, <Isi Catatan>, <Format>"]
handler.tags = ["tools"];
handler.command = /^texttonote|tonote$/i;
handler.owner = false;
handler.limit = 5;

module.exports = handler;