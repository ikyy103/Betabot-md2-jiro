const { hoax } = require('../lib/scrape.js');

let handler = async (m, { conn }) => {
  try {
    let data = await hoax(); // Pastikan hoax() adalah fungsi yang valid
    let src = data.getRandom(); // Pastikan getRandom() ada dalam data
    let cap = `
*Judul:* ${src.title}
*Date:* ${src.date}

*Desc:* _${src.desc}_

*Link:* ${src.link}
`.trim();
    await conn.sendFile(m.chat, src.thumbnail, null, cap, m);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    await conn.sendMessage(m.chat, 'Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.', m);
  }
};

handler.help = ["turnbackhoax"];
handler.tags = ["internet"];
handler.command = /^turnbackhoax|tbh$/i;

module.exports = handler;