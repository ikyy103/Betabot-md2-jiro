const axios = require("axios");
const cheerio = require("cheerio");

async function searchManga(query) {
  try {
    const url = `https://www.maid.my.id/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": "https://www.maid.my.id/",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".flexbox2-item").each((_, el) => {
      const title = $(el).find(".flexbox2-title .title").text().trim();
      const mangaLink = $(el).find("a").attr("href");
      const thumbnail = $(el).find(".flexbox2-thumb img").attr("src");
      const score = $(el).find(".score").text().trim();
      const latestChapter = $(el).find(".season").text().trim();
      const synopsis = $(el).find(".synops p").text().trim();
      const genres = $(el).find(".genres a").map((_, genre) => $(genre).text().trim()).get();

      results.push(
        `📖 *${title}*\n⭐ *Score:* ${score}\n📌 *Chapter Terbaru:* ${latestChapter}\n📚 *Genre:* ${genres.join(", ")}\n🔗 *Link:* ${mangaLink}\n📝 *Sinopsis:* ${synopsis}\n`
      );
    });

    return results.length > 0 ? results.join("\n\n") : "⚠️ Tidak ada hasil ditemukan.";
  } catch (error) {
    console.error("Error saat scraping pencarian manga:", error.message);
    return "⚠️ Terjadi kesalahan saat mencari manga.";
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("⚠️ Harap masukkan judul manga!\n\nContoh: `.mangasearch One Piece`");
  let result = await searchManga(text);
  m.reply(`🔍 *Hasil Pencarian Manga:*\n\n${result}`);
};

handler.help = ["mangasearch <judul>"];
handler.tags = ["anime"];
handler.command = /^(mangasearch)$/i;

module.exports = handler;