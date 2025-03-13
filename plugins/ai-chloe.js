const axios = require("axios");

let handler = async (m, { conn, text, args }) => {
  if (!text) return m.reply("Masukkan pertanyaan untuk Chloe."); // Cek input

  let roleplay = args.join(" ") || "Kamu adalah Chloe, seorang wanita muda yang suka berbicara hal-hal baik di setiap interaksi yang kamu gunakan.";
  let query = encodeURIComponent(text);
  let role = encodeURIComponent(roleplay);
  let apiKey = "${maelyn}"; // Ganti dengan API Key yang benar
  let uuid = "maelynai-0d125044-7673-43bf-b9cd-e94e6fa8997d"; // UUID sesi unik

  let url = `https://api.maelyn.tech/api/maelynai/charchat?q=${query}&roleplay=${role}&uuid=${uuid}&apikey=${apiKey}`;

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } }); // Reaksi loading

  try {
    let { data } = await axios.get(url);
    
    if (data.status === "Success" && data.result.content) {
      let response = data.result.content.trim();

      if (response.length === 0 || /^[\p{Emoji_Presentation}]+$/u.test(response)) { 
        // Jika hanya emoji atau kosong, berikan pesan default
        response = "Maaf, aku tidak tahu harus menjawab apa. Mungkin kamu bisa bertanya sesuatu yang lain? 😊";
      }

      m.reply(response);
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } }); // Reaksi sukses
    } else {
      m.reply("Maaf, Chloe sedang tidak bisa merespon saat ini. Coba lagi nanti!");
    }
  } catch (err) {
    console.error(err);
    m.reply("Terjadi kesalahan saat menghubungi Chloe. Silakan coba lagi.");
  }
};

handler.help = ["chloe <teks>"];
handler.tags = ["ai"];
handler.command = /^(chloe)$/i;

module.exports = handler;