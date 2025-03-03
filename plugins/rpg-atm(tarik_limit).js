const limitmins = 1
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let amount = parseInt(args[0])

    if (!amount) return conn.reply(m.chat, `Masukkan jumlah limit yang ingin ditarik!\n\nContoh:\n*${usedPrefix}${command} 5*`, m)
    if ((user.bankLimit || 0) < amount) return conn.reply(m.chat, `Saldo ATM (Limit) kamu tidak cukup untuk menarik ${amount}!`, m)

    user.bankLimit -= amount
    user.limit += amount

    conn.reply(m.chat, `✅ Berhasil menarik ${amount} limit dari ATM.\n📊 Limit sekarang: ${user.limit}\n🏧 Sisa ATM (Limit): ${user.bankLimit}`, m)
}

handler.help = ['pulllimit <jumlah>']
handler.tags = ['rpg']
handler.command = /^pulllimit$/i
handler.rpg = true

module.exports = handler