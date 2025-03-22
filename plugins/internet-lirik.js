const axios = require('axios');
const cheerio = require('cheerio');

let handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return m.reply(`Please provide a song title or artist name to search for chords!\n\nExample:\n.${command} Shape of You`);
    }

    m.reply('Searching for chords, please wait...');

    const chords = new Chords(text);
    const results = await chords.getSearch();

    if (results.length === 0) {
      return m.reply('No chords found for the given song or artist.');
    }

    const firstResult = results[0]; 
    const detail = await chords.getDetail(firstResult.link);

    if (detail) {
      let message = `
*Chords Found!* 

 Title: ${detail.title}
 Artist: ${detail.artist}
 Date: ${detail.date}
 View Artist Profile : ${detail.artistProfileLink}

 Chords:
${detail.chords}
`;

      await conn.sendMessage(m.chat, { text: message, footer: 'BabyBotz' }, { quoted: m });
    } else {
      m.reply('Failed to fetch chords details.');
    }
  } catch (error) {
    console.error(error);
    m.reply("An error occurred: " + error.message);
  }
};

handler.help = [""lirik"];
handler.tags = ["search"];
handler.command = /^(lirik)$/i;

module.exports = handler;

class Chords {
  constructor(music) {
    this.searchUri = `https://www.gitagram.com/index.php?cat=&s=${encodeURIComponent(music)}`;
  }

  async getSearch() {
    try {
      const { data } = await axios.get(this.searchUri);
      const $ = cheerio.load(data);

      let results = [];
      $("table.table tbody tr").each((index, element) => {
        let title = $(element).find("span.title.is-6").text().trim();
        let artist = $(element).find("span.subtitle.is-6").text().replace("&#8227; ", "").trim();
        let link = $(element).find("a").attr("href");
        let type = $(element).find("span.title.is-7").text().trim();

        results.push({ title, artist, link, type });
      });

      return results;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async getDetail(uri) {
    try {
      const { data } = await axios.get(uri);
      const $ = cheerio.load(data);

      let title = $("h1.title.is-5").text().trim();
      let artist = $("div.subheader a span.subtitle").text().replace("‣", "").trim();
      let artistProfileLink = $("div.subheader a").attr("href");
      let artistImage = $("figure.image img").attr("src");
      let date = $("span.icon-text span:contains('June')").text().trim();

      let chords = [];
      $("div.content pre").each((index, element) => {
        chords.push($(element).text().trim());
      });

      let chordss = chords.join("\n").replace(/\\n/g, "\n");

      return {
        title,
        artist,
        artistProfileLink: `https://www.gitagram.com${artistProfileLink}`,
        artistImage,
        date,
        chords: chordss
      };
    } catch (error) {
      console.error("Error fetching details:", error);
      return null;
    }
  }
}