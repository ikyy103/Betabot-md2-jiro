// Weem :
// https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W
// &
// https://whatsapp.com/channel/0029VasQWtS4NVig014W6v17

let fetch = require('node-fetch')

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `Gunakan dengan cara: ${usedPrefix}${command} <teks>`, m)
    }

    try {
        conn.reply(m.chat, 'Sedang memproses teks...', m)
        
        console.log('Input text:', text)
        
        let apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/humanizer?text=${encodeURIComponent(text)}`
        console.log('API URL:', apiUrl)
        
        let response = await fetch(apiUrl)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
        }
        
        let json = await response.json()
        console.log('API response structure:', Object.keys(json))
        
        if (json.status !== 200 || !json.result) {
            throw new Error('Gagal memanusiakan teks')
        }
        
        let resultText = json.result.trim()
        
        await conn.reply(m.chat, `📝 *HASIL HUMANIZER*\n\n${resultText}`, m)
        
    } catch (error) {
        console.log('Error:', error)
        conn.reply(m.chat, `Error: ${error.message}`, m)
    }
}

handler.help = ['humanizer <teks>']
handler.tags = ['tools', 'ai']
handler.command = /^(humanizer)$/i

module.exports = handler