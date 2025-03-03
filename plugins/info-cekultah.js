let handler = async (m, { text, usedPrefix }) => {
  let user = global.db.data.users[m.sender]

  if (!user.ultah) throw `⚠️ Anda belum mengatur ulang tahun.\nGunakan perintah *${usedPrefix}setultah DD-MM-YYYY* untuk mengaturnya.`

  m.reply(`🎂 Ulang tahun Anda tercatat pada: *${user.ultah}*`)
}

handler.help = ['cekultah']
handler.tags = ['info']
handler.command = /^cekultah$/i
module.exports = handler