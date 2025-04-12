let fetch = require('node-fetch')
let rewardAmount = 100

async function handler(m) {
    conn.tebakpribahasa = conn.tebakpribahasa ? conn.tebakpribahasa : {}
    let id = m.chat
    if (id in conn.tebakpribahasa) {
        return conn.reply(m.chat, 'Masih ada soal yang belum terjawab.\nKetik *nyerah* untuk menyerah.', conn.tebakpribahasa[id].msg)
    }

    let res = await fetch('https://fastrestapis.fasturl.cloud/game/tebakpribahasa')
    let data = await res.json()
    let json = data.result

    let caption = `
┌─⊷ *TEBAK PRIBAHASA*
▢ *Pertanyaan:* ${json.question}
▢ Jawaban hanya satu kata
▢ Waktu: 60 detik
▢ Ketik *nyerah* untuk menyerah
└──────────────
+${rewardAmount} kredit sosial jika benar!
`.trim()

    conn.tebakpribahasa[id] = {
        id,
        msg: await conn.reply(m.chat, caption, m),
        ...json,
        rewardAmount,
        timeout: setTimeout(() => {
            if (conn.tebakpribahasa[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawaban yang benar: *${json.answer}*`, conn.tebakpribahasa[id].msg)
                delete conn.tebakpribahasa[id]
            }
        }, 60000)
    }
}
handler.help = ['tebakpribahasa']
handler.tags = ['game']
handler.command = /^tebakpribahasa$/i
handler.group = true

module.exports = handler