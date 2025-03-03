const axios = require("axios");
const cheerio = require("cheerio");

let handler = async (m, { text }) => {
   try {
      // Validasi input
      if (!text) throw "❌ Masukkan kata kunci untuk membuat nama bisnis. Contoh: *.genbiz website*";

      // URL generator dengan kata kunci
      let url = `https://www.design.com/business-name-generator/tag/${encodeURIComponent(text)}`;

      // Ambil halaman web
      let res = await axios.get(url);
      let $ = cheerio.load(res.data);

      // Debugging: Log seluruh konten HTML jika perlu
      // console.log(res.data);

      // Periksa apakah elemen nama bisnis ada
      let names = [];
      $(".name-generator-list-item h4").each((i, el) => {
         let name = $(el).text().trim();
         if (name) names.push(name);
      });

      // Jika tidak ada nama ditemukan
      if (names.length === 0) throw "❌ Tidak ditemukan nama bisnis untuk kata kunci tersebut.";

      // Kirim nama-nama bisnis ke pengguna
      let message = `✅ *Nama Bisnis yang Dihasilkan untuk: "${text}"*\n\n` +
                    names.map((name, i) => `${i + 1}. ${name}`).join("\n");

      m.reply(message);
   } catch (error) {
      m.reply("❌ Terjadi kesalahan: " + (error.message || error));
      console.error(error);
   }
};

handler.help = ["genbiz <kata kunci>"];
handler.tags = ["tools"];
handler.command = ["genbiz", "businessname", "namabisnis"];

module.exports = handler;