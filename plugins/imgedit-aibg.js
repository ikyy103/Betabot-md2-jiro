const axios = require("axios")
const uploadImage = require('../lib/uploadImage')

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `Balas gambar dengan perintah *${usedPrefix + command} <prompt>*`
    
    if (!args.length) throw 'Masukkan prompt untuk mengganti latar belakang, contoh:\n/aibg A futuristic city skyline'

    let media = await q.download()
    let isImage = /image\/(png|jpe?g|gif)/.test(mime)
    let fileSizeLimit = 5 * 1024 * 1024 

    if (!isImage) throw 'Hanya gambar yang bisa digunakan!'
    if (media.length > fileSizeLimit) throw 'Ukuran media tidak boleh melebihi 5MB'

    let imageUrl = await uploadImage(media)

    let apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/aibackground?imageUrl=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(args.join(" "))}`

    try {
        await conn.sendMessage(m.chat, { react: { text: "🎨", key: m.key } })

        let response = await axios.get(apiUrl, { responseType: "arraybuffer" })

        if (!response || !response.data) {
            return m.reply("❌ *Gagal mendapatkan gambar. Coba lagi nanti.*")
        }

        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Gambar berhasil diedit!*\n🎭 *Prompt:* ${args.join(" ")}`
        })

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

    } catch (err) {
        console.error(err)
        m.reply("❌ *Terjadi kesalahan! Pastikan API aktif dan coba lagi nanti.*")
    }
}

handler.help = ['aibg <reply image> <prompt>']
handler.tags = ['tools','ai','imgedit']
handler.command = /^(aibg)$/i

module.exports = handler