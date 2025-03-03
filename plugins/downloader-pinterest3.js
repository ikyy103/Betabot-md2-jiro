let fetch = require('node-fetch');
let handler = async (m, { usedPrefix, command, conn, args }) => {
  if (!args[0]) throw `*🚩 Example:* ${usedPrefix}${command} Zhao Lusi`;
  m.reply(wait)
  try {
    let response = await fetch(`https://api.fakrulafif.web.id/pinterest?query=${args[0]}`);
    let data = await response.json();   
    let old = new Date()
    let limit = Math.min(5, data.result.length);
    for(let i = 1; i < limit; i++) { 
      await sleep(3000);
      conn.sendFile(m.chat, data.result[i], 'pin.jpg', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m);
    }
  } catch (e) {
    throw `${eror}`;
  }
}

handler.help = ['pinterest3 <keyword>'];
handler.tags = ['internet', 'downloader'];
handler.command = /^(pinterest3|pin3)$/i;
handler.group = true
handler.limit = 3

module.exports = handler;