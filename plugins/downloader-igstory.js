/*
*PLUGINS INSTASTORY*
`TYPE:` *CommonJs*
`CHANNEL:`  *https://whatsapp.com/channel/0029VaWA5U1EQIamnmeXRn2M*

`Thanks To:`  https://bk9.fun (Rest Api's)
*/
const fetch = require('node-fetch')

const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`Gunakan: ${usedPrefix + command} <username>\nContoh: ${usedPrefix + command} dillaljaidi`)
    
    m.reply(global.mess.wait)
    
    try {
        const res = await fetch(`https://bk9.fun/download/igs?username=${encodeURIComponent(text)}`)
        const json = await res.json()

        if (!json.status || !json.BK9 || !Array.isArray(json.BK9)) {
            throw "Gagal mengambil data atau username tidak ditemukan."
        }

        let sentMedia = new Set()
        let uniqueMedia = json.BK9.filter(item => {
            if (!item.url || sentMedia.has(item.url)) return false
            sentMedia.add(item.url)
            return true
        })

        let count = uniqueMedia.length
        let publicMedia = uniqueMedia.slice(0, 3) 
        let privateMedia = uniqueMedia.slice(3)

        if (count > 3) {
            m.reply(`Terdapat ${count} media. 3 media akan dikirim di sini, sementara sisanya akan dikirimkan ke private chat.`)
        }

        for (let item of publicMedia) {
            await sendMedia(conn, m.chat, item, text, m)
        }

        for (let item of privateMedia) {
            await sendMedia(conn, m.sender, item, text, m)
        }

    } catch (e) {
        console.error(e)
        m.reply("Terjadi kesalahan saat mengambil story Instagram.")
    }
}
async function sendMedia(conn, chat, item, username, m) {
    if (item.type === "image") {
        await conn.sendFile(chat, item.url, 'insta.jpg', `Instagram Story @${username}`, m)
    } else if (item.type === "video") {
        await conn.sendFile(chat, item.url, 'insta.mp4', `Instagram Story @${username}`, m)
    }
    await new Promise(resolve => setTimeout(resolve, 2000)) 
}

handler.tags = ["downloader"]
handler.help = ["instastory"]
handler.command = /^(igstory|instagramstory|instastory)$/i
module.exports = handler