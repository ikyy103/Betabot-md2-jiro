let fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('❌ *Contoh Penggunaan:* .sfile Minecraft APK');

    let query = encodeURIComponent(args.join(" "));
    let apiUrl = `https://vapis.my.id/api/sfilesrc?q=${query}`;

    try {
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) return m.reply('❌ Gagal menemukan file.');

        let result = json.data.map((v, i) => 
            `📂 *${v.title}*\n` +
            `📦 Ukuran: ${v.size}\n` +
            `🔗 [Download](${v.link})\n`
        ).join("\n━━━━━━━━━━━━\n");

        m.reply(`🔍 *Hasil Pencarian File di SFile:*\n\n${result}`);
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat mencari file.');
    }
};

handler.help = ['sfiles <kata kunci>'];
handler.tags = ['internet'];
handler.command = /^sfiles$/i;

module.exports = handler;