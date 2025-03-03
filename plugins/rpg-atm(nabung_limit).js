const limitplus = 1
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let amount = parseInt(args[0])

    if (!amount) return conn.reply(m.chat, `Masukkan jumlah limit yang ingin ditabung!\n\nContoh:\n*${usedPrefix}${command} 5*`, m)
    if (user.limit < amount) return conn.reply(m.chat, `Limit kamu tidak cukup untuk menabung ${amount}!`, m)

    user.limit -= amount
    user.bankLimit = (user.bankLimit || 0) + amount

    conn.reply(m.chat, `✅ Berhasil menabung ${amount} limit ke ATM.\n📊 Sisa limit: ${user.limit}\n🏧 Saldo ATM (Limit): ${user.bankLimit}`, m)
}

handler.help = ['atmlimit <jumlah>']
handler.tags = ['rpg']
handler.command = /^atmlimit$/i
handler.rpg = true

module.exports = handler