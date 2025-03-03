const { sticker } = require('../lib/sticker')
let handler = async (m, { conn, text, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!q) throw `Balas gambar/video/stiker dengan perintah .${command} <teks tambahan>`
    if (!mime) throw 'Tidak ada media yang dibalas. Mohon balas gambar/video/stiker!'

    try {
        let media = await q.download()
        if (!media) throw 'Gagal mendownload media, coba lagi.'

        let teksTambahan = text ? text.trim() : 'Stiker Default'
        if (/image/.test(mime)) {
            // Mengirim stiker gambar dengan teks tambahan
            await conn.sendImageAsSticker(m.chat, media, m, {
                packname: teksTambahan,
                author: 'Bot',
            })
        } else if (/video/.test(mime)) {
            // Membatasi durasi video untuk stiker
            if ((q.msg || q).seconds > 6) return m.reply('Durasi video maksimal 6 detik!')
            // Mengirim stiker video dengan teks tambahan
            await conn.sendVideoAsSticker(m.chat, media, m, {
                packname: teksTambahan,
                author: 'Bot',
            })
        } else if (/webp/.test(mime)) {
            // Jika formatnya webp (stiker), tetap memberikan teks tambahan
            await conn.sendImageAsSticker(m.chat, media, m, {
                packname: teksTambahan,
                author: 'Bot',
            })
        } else {
            throw 'Format media tidak didukung! Hanya gambar, video (maksimal 6 detik), atau stiker.'
        }
    } catch (e) {
        console.error(e)
        throw 'Terjadi kesalahan saat memproses permintaan Anda.'
    }
}

handler.help = ['stickercmd  <teks>']
handler.tags = ['sticker']
handler.command = /^(cmd|stickercmd)$/i
handler.limit = true
module.exports = handler