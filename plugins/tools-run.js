const WebSocket = require('ws');
const axios = require('axios');

async function Execute(code, language, onOutput = (output) => {}) {
  return new Promise(async (resolve, reject) => {
    function generateSessionId() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    const response = await axios.post(
      'https://compiler-api.programiz.com/api/v1/code',
      {
        user_id: generateSessionId(),
        session_id: generateSessionId(),
        code: code,
        user_agent: 'Mozilla/5.0',
        language: language
      },
      {
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
        }
      }
    );

    const sessionId = generateSessionId();
    const wsUrl = `wss://${language}.repl-web.programiz.com/socket.io/?sessionId=${sessionId}&lang=${language}&EIO=3&transport=websocket`;
    const ws = new WebSocket(wsUrl);
    let allLogs = '';

    ws.on('open', () => {
      ws.send(`42["run",${JSON.stringify({ code })}]`);
    });

    ws.on('message', (data) => {
      const message = data.toString();
      if (message.startsWith('42["output"')) {
        try {
          const [ , payload ] = JSON.parse(message.substring(2));
          if (payload?.output) {
            const cleanOutput = payload.output.replace(/\\n/g, '\n').trim();
            allLogs += cleanOutput + '\n';
            onOutput(cleanOutput);
          }
        } catch (e) {
          reject(`Output parsing error: ${e.message}`);
        }
      }
    });

    ws.on('close', () => resolve(allLogs.trim()));
    ws.on('error', (err) => reject(`Connection error: ${err.message}`));
  });
}

// Handler untuk WhatsApp bot
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `⚠️ Format salah! Gunakan:\n\n*${usedPrefix}${command} <bahasa> | <kode>*\n\nContoh:\n*${usedPrefix}${command} python | print("Hello, World!")*`;
    }

    let [lang, ...codeArray] = text.split('|');
    if (!lang || codeArray.length === 0) {
        throw `⚠️ Format salah! Gunakan:\n\n*${usedPrefix}${command} <bahasa> | <kode>*`;
    }

    lang = lang.trim().toLowerCase();
    let code = codeArray.join('|').trim();

    // Cek apakah bahasa didukung
    const supportedLanguages = ['c', 'cpp', 'csharp', 'python', 'javascript', 'golang', 'php', 'swift', 'rust'];
    if (!supportedLanguages.includes(lang)) {
        throw `🚫 Bahasa tidak didukung! Pilih salah satu:\n${supportedLanguages.join(', ')}`;
    }

    // Kirim pesan "Memproses..."
    await conn.reply(m.chat, '⏳ Sedang menjalankan kode...', m);

    try {
        let output = await Execute(code, lang);
        if (!output) output = '⚠️ Tidak ada output.';
        
        let message = `📌 *Hasil Eksekusi*\n\n🖥 *Bahasa:* ${lang}\n📜 *Kode:* \n\`\`\`${code}\`\`\`\n📤 *Output:* \n\`\`\`${output}\`\`\``;
        await conn.reply(m.chat, message, m);
    } catch (err) {
        await conn.reply(m.chat, `🚫 Terjadi kesalahan saat eksekusi:\n${err}`, m);
    }
};

handler.help = ['execute', 'run'].map(v => v + ' <bahasa> | <kode>');
handler.tags = ['tools'];
handler.command = /^(execute|run)$/i;
handler.limit = true;

module.exports = handler;