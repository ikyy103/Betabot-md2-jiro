const axios = require('axios');

async function transcribe(url) {
  try {
    const { data } = await axios.get('https://yts.kooska.xyz/', {
      params: { url },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://kooska.xyz/'
      }
    });
    
    return {
      status: true,
      video_id: data.video_id,
      summarize: data.ai_response,
      transcript: data.transcript
    };
  } catch (e) {
    return {
      status: false,
      msg: `Gagal mendapatkan respon: ${e.message}`
    };
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*Cara Penggunaan:*\n${usedPrefix + command} <url video>\n\n*Contoh:*\n${usedPrefix + command} https://youtu.be/wAp2nMJ9ov4?si=Z_x9l2hpXJJX7E6N`);
  }
  
  m.reply('*Membuat Ringkasan Dan Transkrip...*');
  
  const result = await transcribe(text);
  
  if (!result.status) {
    return m.reply(`*Error:* ${result.msg}`);
  }
  
  m.reply(`*Youtube Transcription And Summary*\n\n*Summary Ai :*\n${result.summarize}\n\n*Full Transcription:*\n${result.transcript}`);
}

handler.help = ['transcribe', 'transkripsi'];
handler.tags = ['tools'];
handler.command = /^(transcribe|transkripsi)$/i;
handler.limit = false;

module.exports = handler;