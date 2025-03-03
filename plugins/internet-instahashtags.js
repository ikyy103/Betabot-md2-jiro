let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan teks pencarian`);

    try {
        const response = (await axios.get("https://api.vreden.web.id/api/instagram/hashtags?query=" + text)).data;
        let teks = "*IG HASHTAGS*\n\n";
        for (let i of response.result.hashtags) {
            teks += `ID : ${i.id}\nHashtags: #${i.name}\nDipakai : ${i.usage}\n\n`;
        }
        m.reply(teks);
    } catch (error) {
        await m.reply("Terjadi kesalahan");
    }
};

handler.help = ['instahashtags <hashtag>'];
handler.tags = ['internet'];
handler.command = /^(instahashtags)$/i;
handler.limit = true;

module.exports = handler;