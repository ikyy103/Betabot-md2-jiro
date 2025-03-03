const axios = require("axios");

let handler = async (m, { conn, text }) => {
  if (!text || isNaN(text)) {
    return m.reply("Masukkan nomor surah yang valid! 📜");
  }

  try {
    const response = await axios.get(`https://api.lolhuman.xyz/api/quran/audio/${text}?apikey=d7d4f141dbbb07e0dcb6e7a1`);
    const data = response.data;

    if (!data || !data.result) {
      return m.reply("Surah tidak ditemukan atau terjadi kesalahan. ❌");
    }

    let pesan = `📖 *Audio Surah Nomor ${text}*\n`;
    pesan += `🎧 *Silakan dengarkan audio berikut:*\n${data.result}`;

    await conn.sendMessage(m.chat, { audio: { url: data.result }, mimetype: "audio/mp4" }, { quoted: m });
    m.reply(pesan);
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan dalam mengambil data. ⚠️");
  }
};

handler.help = ["quranaudio <nomor surah>"];
handler.tags = ["islami"];
handler.command = /^(quranaudio)$/i;

module.exports = handler;