let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')
const { createHash } = require('crypto')

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let who = m.sender
  let pp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXIdvC1Q4WL7_zA6cJm3yileyBT2OsWhBb9Q&usqp=CAU'

  try {
    pp = await conn.profilePictureUrl(who, 'image')
  } catch (e) {}

  if (!user) {
    return conn.reply(m.chat, '⚠️ Data pengguna tidak ditemukan dalam database.', m)
  }

  function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000))
    let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    return `${days} Hari ${hours} Jam ${minutes} Menit`
  }

  let now = Date.now()
  let vipStatus = user.premium ? 'Yes' : 'No'
  let vipTimeLeft = user.premiumTime > now ? msToDate(user.premiumTime - now) : 'Tidak diatur expired VIP!'
  let username = conn.getName(who)
  let about = (await conn.fetchStatus(who).catch(() => ({}))).status || 'Tidak ada bio'
  let sn = createHash('md5').update(who).digest('hex')
  let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)
  let xpNext = max - xp

  let profileText = `
┌───⊷ *MY PROFILE*
👤 Nama: ${username} (${user.name || 'Tidak terdaftar'})
📝 Bio: ${user.bio || about}
📞 Nomor: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
🚀 VIP Status: ${vipStatus}
🏆 Poin VIP: ${user.vipPoint || 0}
⏳ VIP Expired: ${vipTimeLeft}
🔢 Serial Number: ${sn}
🌀 Gender: ${user.gender || 'Belum diatur'}
🏙️ Kota: ${user.kota || 'Belum diatur'}
└──────────────

┌───⊷ *ECONOMY*
💰 Saldo: ${user.money}
🛒 Limit: ${user.limit}
└──────────────

┌───⊷ *GAME RPG*
🏅 XP: ${user.exp} (${xp - min}/${xp}) ${xpNext <= 0 ? `🔺 *Ready to level up!*` : `⚡ ${xpNext} XP lagi untuk level up`}
📊 Level: ${user.level}
🔖 Role: ${user.role}
└──────────────

📌 *Gunakan* _#setbio <teks>_ *untuk mengatur bio baru!* 📝
📌 *Gunakan* _#setgender <pria/wanita>_ *untuk mengatur gender!* 🚻
`.trim()

  conn.sendFile(m.chat, pp, 'profile.jpg', profileText, m)
}

handler.help = ['profilev1']
handler.tags = ['info']
handler.command = /^profilev1$/i
handler.limit = false
handler.register = true

module.exports = handler