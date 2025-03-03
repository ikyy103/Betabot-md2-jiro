const axios = require("axios");

let handler = async (m, { conn, text }) => {
  if (!text || isNaN(text)) {
    return m.reply("Masukkan nomor surah yang valid!");
  }

  try {
    const response = await axios.get(`https://api.vreden.my.id/api/islami/quranaudio?nomor=${text}`);
    const data = response.data.result;

    if (!data || !data.audio) {
      return m.reply("Surah tidak ditemukan atau terjadi kesalahan.");
    }

    let pesan = `📖 *Surah ${data.asma.id.long}* (${data.asma.id.translation})\n`;
    pesan += `📌 *Nomor:* ${data.number}\n`;
    pesan += `📜 *Ayat:* ${data.ayatCount} ayat\n`;
    pesan += `🏛️ *Tipe:* ${data.type}\n\n`;
    pesan += `📖 *Tafsir:* ${data.tafsir}\n\n`;
    pesan += `🎧 *Audio:* ${data.audio}`;

    await conn.sendMessage(m.chat, { audio: { url: data.audio }, mimetype: "audio/mp4" }, { quoted: m });
    m.reply(pesan);
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan dalam mengambil data.");
  }
};

handler.help = ["quran <nomor surah>"];
handler.tags = ["islami"];
handler.command = /^(quran|quranaudio)$/i;

module.exports = handler;