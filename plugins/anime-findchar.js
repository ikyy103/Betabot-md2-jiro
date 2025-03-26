// Weem :
// https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W
// https://whatsapp.com/channel/0029VasQWtS4NVig014W6v17

let uploadImage = require('../lib/uploadImage.js')
let fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Kirim gambar atau balas gambar dengan caption *findchar*', m)

    let media = await q.download()
    let uploadedImageUrl = await uploadImage(media)

    console.log(`Gambar berhasil diupload: ${uploadedImageUrl}`)

    try {
        let response = await fetch(`https://fastrestapis.fasturl.cloud/anime/characterfinder?url=${encodeURIComponent(uploadedImageUrl)}`)
        let result = await response.json()

        console.log(`Hasil dari API: ${JSON.stringify(result)}`)

        if (result.status === 200 && result.result.character.length > 0) {
            let charList = result.result.character.map(c => `*${c.name}* (Confidence: ${(c.confidence * 100).toFixed(2)}%)`).join('\n')
            let message = `Karakter yang ditemukan:\n\n${charList}`
            await conn.reply(m.chat, message, m)
        } else {
            conn.reply(m.chat, 'Tidak dapat menemukan karakter dalam gambar.', m)
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error)
        conn.reply(m.chat, 'Terjadi kesalahan saat mencari karakter, coba lagi nanti.', m)
    }
}

handler.help = ['findchar']
handler.tags = ['anime']
handler.command = /^(findchar)$/i

module.exports = handler