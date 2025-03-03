let handler = async (m, { conn, args, usedPrefix, command }) => {
    let target = m.mentionedJid[0] || m.sender
    let user = global.db.data.users[target]

    let name = user.name
    let balance = user.money
    let limit = user.limit
    let atmMoney = user.bankMoney || 0 // ATM untuk Money
    let atmLimit = user.bankLimit || 0 // ATM untuk Limit

    let capt = `乂  *🏦 BANK - USER 🏦*  乂\n\n`
    capt += `  ◦  *👤 Nama* : ${name}\n`
    capt += `  ◦  *💰 Saldo (Money)* : ${balance}\n`
    capt += `  ◦  *🏧 ATM (Money)* : ${atmMoney}\n`
    capt += `  ◦  *📊 Limit* : ${limit}\n`
    capt += `  ◦  *🏧 ATM (Limit)* : ${atmLimit}\n\n`
    capt += `> *${usedPrefix}atm <jumlah>* untuk menabung uang ke ATM (Money)\n`
    capt += `> *${usedPrefix}pull <jumlah>* untuk menarik uang dari ATM (Money)\n`
    capt += `> *${usedPrefix}atmlimit <jumlah>* untuk menabung limit ke ATM (Limit)\n`
    capt += `> *${usedPrefix}pulllimit <jumlah>* untuk menarik limit dari ATM (Limit)\n`

    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: capt,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: wm,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://pomf2.lain.la/f/106ebnd3.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w'
                }
            },
            mentions: [m.sender]
        }
    }, {})
}

handler.help = ['bank']
handler.tags = ['rpg']
handler.command = /^bank$/
handler.rpg = true
handler.register = true

module.exports = handler