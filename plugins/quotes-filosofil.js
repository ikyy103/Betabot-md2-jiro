let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const quotes = require('../lib/json/filosofil.json'); 
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]; 
  m.reply(`"${randomQuote.quote}" - ${randomQuote.author}`); 
};

handler.help = ['filosofil'];
handler.tags = ['inspirasi', 'quotes', 'fun'];
handler.command = /^filosofil$/i;
handler.limit = true;
module.exports = handler;