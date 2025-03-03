const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Masukkan kata kunci untuk mencari dalam file.\n\n*Contoh:* .findcmd mediafire");

    try {
        const dirPath = __dirname; // Direktori tempat handler berada
        const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.js')); // Ambil hanya file JavaScript

        let foundFiles = [];

        // Loop untuk membaca isi file
        for (let file of files) {
            const filePath = path.join(dirPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Cek apakah kata kunci ada dalam handler.help atau handler.command
            if (content.includes(`handler.help = ['${text}`) || content.includes(`handler.command = /^(.*${text}.*)$/i`)) {
                foundFiles.push(file);
            }
        }

        if (foundFiles.length === 0) return m.reply(`Tidak ada file yang mengandung kata *${text}* di dalam handler.help atau handler.command.`);

        let fileList = foundFiles.map((file, index) => `*${index + 1}.* ${file}`).join("\n");

        let caption = `🔍 *Hasil Pencarian untuk:* "${text}"\n\n📂 *File yang ditemukan:*\n${fileList}`;
        await m.reply(caption);
    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat mencari dalam file.");
    }
};

handler.help = ['findcmd'];
handler.tags = ['tools'];
handler.command = /^(findcmd)$/i; // CMD untuk mencari berdasarkan teks dalam handler

module.exports = handler;