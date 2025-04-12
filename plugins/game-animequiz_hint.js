let similarity = require('similarity')
const threshold = 0.72

module.exports = {
    async before(m) {
        conn.animequiz = conn.animequiz || {}
        let id = m.chat
        if (!(id in conn.animequiz)) return

        let room = conn.animequiz[id]
        let text = m.text.trim().toLowerCase()

        if (text === 'nyerah') {
            clearTimeout(room.timeout)
            conn.reply(m.chat, `Permainan berakhir karena menyerah.\nJawaban yang benar: *${room.correct}*`, room.msg)
            delete conn.animequiz[id]
            return !0
        }

        let pilihan = ['a', 'b', 'c', 'd']
        if (!pilihan.includes(text)) return

        let index = pilihan.indexOf(text)
        let jawabUser = room.options[index]

        if (jawabUser === room.correct) {
            global.db.data.users[m.sender].money += room.rewardAmount
            conn.reply(m.chat, `Benar! +${room.rewardAmount} kredit sosial`, room.msg)
        } else {
            conn.reply(m.chat, `Salah! Jawaban yang benar: *${room.correct}*`, room.msg)
        }

        clearTimeout(room.timeout)
        delete conn.animequiz[id]
        return !0
    }
}