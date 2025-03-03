let fs = require('fs')
let handler = async (m, { text, usedPrefix, command }) => {
    if (conn.user.jid !== global.conn.user.jid) return
    if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} menu`, m)
    try {
    if (!m.quoted.text) return conn.reply(m.chat, `🚩 Reply Code Message!`, m)
    let path = `plugins/${text}.js`
    await fs.writeFileSync(path, m.quoted.text)
    conn.reply(m.chat, `🚩 Saved in ${path}`, m)
   } catch (error) {
    console.log(error)
    conn.reply(m.chat, "🚩 Reply Code Message!", m)
  }
}
handler.help = ['sp','saveplugins']
handler.tags = ['owner']
handler.command = ['sp','saveplugins']

handler.owner = true
module.exports = handler;