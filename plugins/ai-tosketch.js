// Wm : https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W

let uploadImage = require('../lib/uploadImage.js')
let fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Kirim gambar atau balas gambar dengan caption *tosketch <styleID>*', m)

    let styleID = text.trim()
    if (!styleID || isNaN(styleID)) return conn.reply(m.chat, `Gunakan format: *tosketch <styleID>*

Contoh: *tosketch 10*

Daftar Style ID:
2. Anime Sketch
3. Line Art
4. Simplex
5. Doodle
6. Intricate Line
8. Sketch
10. Pencil Sketch
11. Ink Sketch
12. Manga Sketch
13. Gouache
14. Color Rough
15. BG Line
16. Ink Painting`, m)

    const styleNames = {
        "2": "Anime Sketch",
        "3": "Line Art",
        "4": "Simplex",
        "5": "Doodle",
        "6": "Intricate Line",
        "8": "Sketch",
        "10": "Pencil Sketch",
        "11": "Ink Sketch",
        "12": "Manga Sketch",
        "13": "Gouache",
        "14": "Color Rough",
        "15": "BG Line",
        "16": "Ink Painting"
    }
    
    if (!styleNames[styleID]) return conn.reply(m.chat, 'Style ID tidak valid. Silakan pilih ID yang tersedia dalam daftar.', m)
    
    let styleName = styleNames[styleID]
    let media = await q.download()
    let uploadedImageUrl = await uploadImage(media)

    let waitMsg = await conn.reply(m.chat, 'Sedang memproses gambar...', m)

    try {
        let apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/tosketch?imageUrl=${encodeURIComponent(uploadedImageUrl)}&style=${encodeURIComponent(styleName)}`
        let response = await fetch(apiUrl)
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
        }
        
        let buffer = await response.buffer()
        
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ Style: ${styleName} | Proses selesai!` 
        }, { quoted: m })
        
    } catch (error) {
        conn.reply(m.chat, `Error: ${error.message}`, m)
    }
}

handler.help = ['tosketch <styleID>']
handler.tags = ['tools', 'premium']
handler.command = /^(tosketch)$/i
handler.premium = true

module.exports = handler