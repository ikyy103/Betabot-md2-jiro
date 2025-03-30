const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://videy.co/v?id=QtZ8jT1X1`;

  try {
    if (!text.match(/videy/gi)) throw `URL Tidak Ditemukan!`;

    m.reply('Tunggu sebentar...');

    const apikey = '${global.lann}';
    const url = `https://api.betabotz.eu.org/api/download/videy?url=${text}&apikey=${lann}`;

    const res = await axios.get(url);
    const data = res.data;

    if (data.status) {
      await conn.sendFile(m.chat, data.result, 'videy.mp4', '*DONE*', m);
    } else {
      throw data.message;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['videy'];
handler.command = /^(videy|videydl)$/i;
handler.tags = ['downloader'];
handler.limit = true;

module.exports = handler;