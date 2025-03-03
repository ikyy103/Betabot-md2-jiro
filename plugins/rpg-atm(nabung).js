const moneyplus = 1
let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender]
  let count = command.replace(/^atm/i, '')
  count = count ? /all/i.test(count) ? Math.floor(user.money / moneyplus) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  
  if (user.money >= moneyplus * count) {
    user.money -= moneyplus * count
    user.bankMoney = (user.bankMoney || 0) + count // Saldo ATM Money terpisah
    conn.reply(m.chat, `🚩 -${moneyplus * count} Money\n+ ${count} ATM Money`, m)
  } else {
    conn.reply(m.chat, `🚩 Uang kamu tidak cukup untuk menabung ${count} ke ATM Money`, m)
  }
}
handler.help = ['atm *<jumlah>*', 'atmall']
handler.tags = ['rpg']
handler.command = /^(atm([0-9]+)|atm|atmall)$/i
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