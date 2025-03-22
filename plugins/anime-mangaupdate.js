const axios = require("axios");
const cheerio = require("cheerio");

async function latestMangaUpdate() {
  try {
    const url = "https://www.maid.my.id/";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": "https://www.maid.my.id/",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".flexbox3-item").each((_, el) => {
      const title = $(el).find(".title a").text().trim();
      const mangaLink = $(el).find(".title a").attr("href");
      const thumbnail = $(el).find(".flexbox3-thumb img").attr("src");

      const chapters = [];
      $(el).find(".chapter li").each((_, chapterEl) => {
        const chapterTitle = $(chapterEl).find("a").text().trim();
        const chapterLink = $(chapterEl).find("a").attr("href");
        const releaseDate = $(chapterEl).find(".date").text().trim();

        chapters.push(`📖 *${chapterTitle}*\n📅 *Tanggal Rilis:* ${releaseDate}\n🔗 *Link:* ${chapterLink}`);
      });

      results.push(
        `📚 *${title}*\n🔗 *Link Manga:* ${mangaLink}\n${chapters.join("\n")}`
      );
    });

    return results.length > 0 ? results.join("\n\n") : "⚠️ Tidak ada update terbaru saat ini.";
  } catch (error) {
    console.error("Error saat scraping update manga:", error.message);
    return "⚠️ Terjadi kesalahan saat mengambil update terbaru.";
  }
}

let handler = async (m, { conn }) => {
  let result = await latestMangaUpdate();
  m.reply(`📢 *Update Terbaru Manga:*\n\n${result}`);
};

handler.help = ["mangaupdate"];
handler.tags = ["anime"];
handler.command = /^(mangaupdate)$/i;

module.exports = handler;