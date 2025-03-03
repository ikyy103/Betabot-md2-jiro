const moneymins = 1
let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender]
  let count = command.replace(/^pull/i, '')
  count = count ? /all/i.test(count) ? Math.floor(user.bankMoney || 0 / moneymins) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)

  if ((user.bankMoney || 0) >= moneymins * count) {
    user.bankMoney -= moneymins * count
    user.money += count
    conn.reply(m.chat, `🚩 -${moneymins * count} ATM Money\n+ ${count} Money`, m)
  } else {
    conn.reply(m.chat, `🚩 Saldo ATM Money kamu tidak cukup untuk menarik ${count} Money`, m)
  }
}
handler.help = ['pull *<jumlah>*', 'pullall']
handler.tags = ['rpg']
handler.command = /^pull([0-9]+)|pull|pullall$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = true
handler.admin = false
handler.botAdmin = false
handler.rpg = true

handler.fail = null
handler.exp = 0

module.exports = handler