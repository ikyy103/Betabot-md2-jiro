const fetch = require("node-fetch");

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("Masukkan kata kunci pencarian!");

    let query = encodeURIComponent(args.join(" "));
    let apiUrl = `https://fastrestapis.fasturl.cloud/downup/bstationdown?name=${query}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200 || !data.result.length) {
            return m.reply("Video tidak ditemukan!");
        }

        let resultText = `*Hasil Pencarian Video:*\n\n`;
        data.result.forEach((vid, index) => {
            resultText += `*${index + 1}. ${vid.title}*\n`;
            resultText += `👁️ ${vid.views}\n`;
            resultText += `🎥 [Tonton Video](${vid.url})\n`;
            resultText += `📸 Thumbnail: ${vid.thumbnail}\n`;
            resultText += `⏳ Durasi: ${vid.duration}\n`;
            resultText += `👤 Oleh: ${vid.author.name}\n\n`;
        });

        m.reply(resultText);
    } catch (error) {
        console.error(error);
        m.reply("Terjadi kesalahan dalam mengambil data!");
    }
};

handler.help = ["bstationsearch <nama anime>"];
handler.tags ["internet", "search", " anime"];
handler.command = ["bstationsearch","biliblisearch","bilis","sbili","sbstation","bstations"];
handler.limit = 3;
handler.private = false;
module.exports = handler;