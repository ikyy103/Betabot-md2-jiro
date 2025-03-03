let handler = async (m, { text, usedPrefix }) => {
  let user = global.db.data.users[m.sender]

  if (!text) throw `⚠️ Masukkan tanggal ulang tahun Anda dengan format:\n\n*${usedPrefix}setultah DD-MM-YYYY*\nContoh: ${usedPrefix}setultah 25-12-2000`

  let [day, month, year] = text.split('-').map(v => parseInt(v))
  if (!day || !month || !year || day > 31 || month > 12 || year > new Date().getFullYear()) {
    throw `⚠️ Format tanggal tidak valid! Gunakan format DD-MM-YYYY.`
  }

  user.ultah = `${day}-${month}-${year}`
  m.reply(`✅ Ulang tahun Anda berhasil diatur: *${day}-${month}-${year}*`)
}

handler.help = ['setultah <DD-MM-YYYY>']
handler.tags = ['info']
handler.command = /^setultah$/i
module.exports = handler