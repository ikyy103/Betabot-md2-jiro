const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

const cooldown = new Map();

async function nesabamediaSearch(keyword) {
    try {
        const { data } = await axios.get(`https://www.nesabamedia.com/?s=${encodeURIComponent(keyword)}&id=124772&post_type=post`);
        const $ = cheerio.load(data);
        
        const results = [];

        $(".inside-article").each((index, element) => {
            const judul = $(element).find(".entry-title a").text().trim();
            const link = $(element).find(".entry-title a").attr("href");
            const pembuat = $(element).find(".author-name").text().trim();
            const image = $(element).find(".post-image img").attr("src");
            const desc = $(element).find(".entry-summary p").text().trim();
            const kategori = $(element).find(".cat-links a").map((i, el) => $(el).text().trim()).get();
            const tag = $(element).find(".tags-links a").map((i, el) => $(el).text().trim()).get();

            results.push({
                judul,
                link,
                pembuat,
                image,
                desc,
                kategori,
                tag,
            });
        });

        return results.length > 0 ? results : "❌ Tidak ada hasil ditemukan!";
    } catch (error) {
        return `❌ Error: ${error.message}`;
    }
}

const handler = async (m, { conn, args }) => {
    try {
        const userId = m.sender;
        const now = moment();

        // Jeda penggunaan 7 detik
        if (cooldown.has(userId) && now.diff(cooldown.get(userId), "seconds") < 7) {
            const remainingTime = 7 - now.diff(cooldown.get(userId), "seconds");
            throw `⏳ Mohon tunggu ${remainingTime} detik sebelum mencari lagi.`;
        }

        if (!args.length) throw "🔎 Masukkan kata kunci pencarian. Contoh: `.nesabamedia-search whatsapp`";

        const keyword = args.join(" ");
        const results = await nesabamediaSearch(keyword);

        if (typeof results === "string") throw results;

        let message = `🔎 *Hasil Pencarian NesabaMedia: ${keyword}*\n\n`;
        results.slice(0, 5).forEach((article, index) => {
            message += `📌 *${index + 1}. ${article.judul}*\n`;
            message += `📜 ${article.desc}\n`;
            message += `🔗 [Baca Selengkapnya](${article.link})\n\n`;
        });

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });

        cooldown.set(userId, now);
    } catch (error) {
        m.reply(error.toString());
    }
};

handler.help = ["nesabamedia-search"];
handler.tags = ["search"];
handler.command = /^nesabamedia-search|nsearch$/i;
handler.register = true;

module.exports = handler;