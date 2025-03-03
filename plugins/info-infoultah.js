let handler = async (m, { conn }) => {
  let now = new Date()
  let day = now.getDate()
  let month = now.getMonth() + 1

  let listUltah = Object.keys(global.db.data.users)
    .map(jid => {
      let user = global.db.data.users[jid]
      if (!user.ultah) return null
      let [d, m] = user.ultah.split('-').map(v => parseInt(v))
      if (d === day && m === month) {
        return `• @${jid.split('@')[0]}`
      }
      return null
    })
    .filter(v => v)

  if (listUltah.length === 0) {
    m.reply('⚠️ Tidak ada pengguna yang berulang tahun hari ini.')
  } else {
    m.reply(`🎉 Pengguna yang berulang tahun hari ini:\n\n${listUltah.join('\n')}`, null, {
      contextInfo: { mentionedJid: conn.parseMention(listUltah.join('\n')) }
    })
  }
}

handler.help = ['infoultah']
handler.tags = ['info']
handler.command = /^infoultah$/i
module.exports = handler