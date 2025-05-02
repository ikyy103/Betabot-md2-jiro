let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!global.owner.some(([id]) => id === m.sender))
    return m.reply('Fitur ini hanya bisa dipakai owner bot.')

  let number
  if (m.quoted) {
    number = m.quoted.sender
  } else if (text) {
    number = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    return m.reply(`Ketik nomor, tag, atau reply pesan target yang mau dicabut ownernya.\nContoh: *.unowner 628xxxxxx*`)
  }

  let index = global.owner.findIndex(([id]) => id === number)
  if (index < 0) return m.reply(`Nomor itu tidak terdaftar sebagai owner.`)

  global.owner.splice(index, 1)
  m.reply(`Berhasil menghapus @${number.split('@')[0]} dari daftar owner.`, {
    mentions: [number]
  })
}

handler.help = ['unowner <nomor|reply|tag>']
handler.tags = ['owner']
handler.command = /^unowner$/i
handler.owner = true

module.exports = handler