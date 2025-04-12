const similarity = require('similarity')
const threshold = 0.72

module.exports = {
    async before(m) {
        conn.tebakpribahasa = conn.tebakpribahasa || {}
        let id = m.chat
        if (!(id in conn.tebakpribahasa)) return !0
        let room = conn.tebakpribahasa[id]
        let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
        if (!room) return !0
        if (text === 'nyerah') {
            conn.reply(m.chat, `Permainan berakhir karena menyerah.\nJawaban yang benar: *${room.answer}*`, room.msg)
            clearTimeout(room.timeout)
            delete conn.tebakpribahasa[id]
            return !0
        }
        if (text === room.answer.toLowerCase()) {
            global.db.data.users[m.sender].money += room.rewardAmount
            conn.reply(m.chat, `*Benar!*\nJawabannya adalah *${room.answer}*\n+${room.rewardAmount} kredit sosial`, room.msg)
            clearTimeout(room.timeout)
            delete conn.tebakpribahasa[id]
        } else {
            let similarityScore = similarity(text, room.answer.toLowerCase())
            if (similarityScore >= threshold) {
                m.reply('Dikit lagi!')
            } else {
                m.reply('*Salah!*')
            }
        }
        return !0
    }
}