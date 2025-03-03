let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  try {
    if (!q.viewOnce) throw 'Bukan Pesan Viewonce'
    let mmk = await q.download?.()
    conn.sendFile(m.chat, mmk, null, wm, m)
  } catch (e) {
    m.reply('Ini bukan pesan viewonce!!')
    console.error(e)
  }
}

handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'rvo', 'liat', 'readvo']
handler.premium = false
handler.register = false
handler.fail = null

module.exports = handler