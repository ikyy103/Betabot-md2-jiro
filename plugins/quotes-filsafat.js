let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const quotes = require('../lib/json/filsafat.json');
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  m.reply(`"${randomQuote.quote}"\n- ${randomQuote.author}`);
};

handler.help = ['filsafat'];
handler.tags = ['inspirasi', 'quotes', 'fun'];
handler.command = /^filsafat$/i;
handler.limit = true;
module.exports = handler;