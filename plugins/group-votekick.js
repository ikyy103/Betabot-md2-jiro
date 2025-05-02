/*
*<>VOTEKICK, UNTUK MENGVOTE HASIL KICK TERGANTUNG MEMBER YANG MILIH<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
HAPUS WM=SDM RENDAH 
*BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!*
"aku janji tidak akan hapus wm ini"
KAMIS, 24 APRIL 2025 19:41
*/
let voteKicks = {}

let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
  if (!isAdmin) throw 'Fitur ini cuma bisa dipakai admin.'
  if (!isBotAdmin) throw 'Bot harus jadi admin dulu.'

  const mentionedJid = m.mentionedJid?.[0]
  if (!mentionedJid) throw 'Tag orang yang mau divote.'
  if (mentionedJid === m.sender) throw 'Nggak bisa vote diri sendiri.'
  if (!participants.some(p => p.id === mentionedJid)) throw 'Orangnya nggak ada di grup.'
  if (voteKicks[m.chat]) throw 'Masih ada votekick yang jalan di grup ini.'

  const name = await conn.getName(mentionedJid)
  const voteMsg = await conn.sendMessage(m.chat, {
    text: `Vote kick dimulai!\n\nApakah *${name}* harus dikeluarkan dari grup?\n\nBalas pesan ini dengan *yes* atau *no* dalam 5 menit.`,
    mentions: [mentionedJid]
  })

  voteKicks[m.chat] = {
    target: mentionedJid,
    voteMessageId: voteMsg.key.id,
    yes: new Set(),
    no: new Set()
  }

  await delay(60 * 5000)

  const vote = voteKicks[m.chat]
  if (!vote) return

  const yes = [...vote.yes]
  const no = [...vote.no]
  const yesCount = yes.length
  const noCount = no.length
  delete voteKicks[m.chat]

  let teks = `Hasil vote:\n\n`
  teks += `YES (${yesCount}): ${yes.map(v => '@' + v.split('@')[0]).join(', ') || '-'}\n`
  teks += `NO  (${noCount}): ${no.map(v => '@' + v.split('@')[0]).join(', ') || '-'}\n\n`

  if (yesCount > noCount) {
    teks += `*${name}* akan dikeluarkan dari grup.`
    await conn.sendMessage(m.chat, { text: teks, mentions: [...yes, ...no, vote.target] })
    await conn.groupParticipantsUpdate(m.chat, [vote.target], 'remove')
  } else {
    teks += `*${name}* tetap di grup.`
    await conn.sendMessage(m.chat, { text: teks, mentions: [...yes, ...no, vote.target] })
  }
}
//by https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
handler.before = async (m) => {
  const vote = voteKicks[m.chat]
  if (!vote || !m.quoted || m.quoted.id !== vote.voteMessageId) return

  const text = m.text.toLowerCase()
  if (text === 'yes') {
    vote.no.delete(m.sender)
    vote.yes.add(m.sender)
  } else if (text === 'no') {
    vote.yes.delete(m.sender)
    vote.no.add(m.sender)
  }
}

handler.tags = ['group'];
handler.command = /^votekick$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
module.exports = handler;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}