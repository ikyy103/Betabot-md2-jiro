let fetch = require('node-fetch')
let winScore = 500
let minReward = 100
let maxReward = 3000

async function handler(m) {
    conn.animequiz = conn.animequiz || {}
    let id = m.chat
    if (id in conn.animequiz) return m.reply('Masih ada kuis yang belum selesai!\nKetik *nyerah* untuk menyerah.')
    let res = await fetch('https://fastrestapis.fasturl.cloud/game/animequiz')
    let json = await res.json()
    let q = json.result.question
    let rewardAmount = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward
    let caption = ` 
┌─⊷ *ANIME QUIZ* 
▢ Tebak karakter anime dari gambar di bawah ini!
▢ Waktu: *2 menit*
▢ Tipe: *Pilihan Ganda*
▢ Ketik *A*, *B*, *C*, atau *D*
▢ Ketik *nyerah* untuk menyerah
└──────────────
A. ${q.answers[0].character} - ${q.answers[0].anime}
B. ${q.answers[1].character} - ${q.answers[1].anime}
C. ${q.answers[2].character} - ${q.answers[2].anime}
D. ${q.answers[3].character} - ${q.answers[3].anime}
`.trim()
    let msg = await conn.sendFile(m.chat, q.image_url, 'anime.jpg', caption, m)
    conn.animequiz[id] = {
        id,
        msg,
        correct: q.correct_answer.character.toLowerCase(),
        options: q.answers.map(a => a.character.toLowerCase()),
        rewardAmount,
        timeout: setTimeout(() => {
            if (conn.animequiz[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawaban yang benar adalah: *${q.correct_answer.character}* dari *${q.correct_answer.anime}*`, conn.animequiz[id].msg)
                delete conn.animequiz[id]
            }
        }, 2 * 60 * 1000)
    }
}

handler.help = ['animequiz']
handler.tags = ['game']
handler.command = /^animequiz$/i
handler.group = true

module.exports = handler