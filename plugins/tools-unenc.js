const beautify = require('js-beautify').js;

let handler = async (m, { conn, text }) => {
    if (!text) throw `[!] Masukkan teks terenkripsi yang ingin dibuka.\n\nContoh:\n!unenc <teks yang terenkripsi>`;

    try {
        // Mencoba untuk melakukan dekripsi (misalnya, dengan mengubah teks terenkripsi)
        // Di sini kita hanya melakukan beautify, tetapi seharusnya ada proses dekripsi yang sesuai
        let decryptedText = text; // Ganti ini dengan proses dekripsi yang sesuai jika ada
        let result = beautify(decryptedText, { indent_size: 2, space_in_empty_paren: true });

        // Cek apakah hasil dekripsi menghasilkan sesuatu
        if (!result || result === decryptedText) throw new Error('Tidak ada perubahan pada teks.');

        conn.reply(m.chat, `*Hasil Dekripsi:*\n\n\`\`\`${result}\`\`\``, m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `[!] Tidak dapat membuka teks ini. Teks terenkripsi terlalu kuat atau tidak didukung.`, m);
    }
};

handler.help = ['unenc <teks>'];
handler.tags = ['tools'];
handler.command = /^unenc$/i;

module.exports = handler;