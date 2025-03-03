let levelling = require('../lib/levelling')

let handler = m => {
  let user = global.db.data.users[m.sender]
  if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)
    throw `
Level *${toRupiah(user.level)} (${toRupiah(user.exp - min)}/${toRupiah(xp)})*
Kurang *${toRupiah(max - user.exp)}* lagi!
`.trim()
  }
  let before = user.level * 1
	while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
	if (before !== user.level) {
            m.reply(`
Selamat, anda telah naik level! 🎉
*${toRupiah(before)}* -> *${toRupiah(user.level)}*
gunakan *.profile* untuk mengecek
	`.trim())
        }
}

handler.help = ['levelup']
handler.tags = ['xp']

handler.command = /^level(|up)$/i

module.exports = handler


const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")