const axios = require('axios');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  conn.autolang = conn.autolang || {};
  
  if (!args[0]) throw `Gunakan format: .setlearnlang <kode_bahasa> <tingkat> Contoh: .setlearnlang en beginner .autolang on/off`;
  
  if (command === 'setlearnlang') {
    let [lang, level] = args;
    if (!lang || !level) throw 'Harap masukkan kode bahasa dan tingkat pengetahuan!';
    conn.autolang[m.sender] = { 
      lang, 
      level: level.toLowerCase(), 
      session: [] 
    };
    m.reply(`Berhasil menyetel bahasa ke *${lang}* dan tingkat ke *${level}*.`);
  } else if (command === 'autolang') {
    let option = args[0];
    if (option === 'on') {
      if (!conn.autolang[m.sender]) return m.reply('Silakan set bahasa dulu dengan .setlearnlang');
      conn.autolang[m.sender].active = true;
      m.reply('Belajar bahasa asing dimulai! Kamu sekarang dalam mode kursus.');
    } else if (option === 'off') {
      if (conn.autolang[m.sender]) conn.autolang[m.sender].active = false;
      m.reply('Belajar bahasa asing dinonaktifkan.');
    } else if (option === 'reset') {
      if (conn.autolang[m.sender]) delete conn.autolang[m.sender];
      m.reply('Pengaturan belajar bahasa asing telah direset.');
    } else {
      throw 'Gunakan .autolang on, .autolang off, atau .autolang reset';
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.autolang = conn.autolang || {};
  if (!m.text || m.fromMe || m.isBaileys) return;
  const user = conn.autolang[m.sender];
  if (!user || !user.active) return;
  const { lang, level, session } = user;
  
  const promptIntro = {
    beginner: `Ajari saya bahasa ${lang} untuk tingkat pemula. Berikan contoh percakapan sederhana dan jelaskan tata bahasa dasar.`,
    intermediate: `Bantu saya belajar bahasa ${lang} untuk tingkat menengah. Fokus pada percakapan sehari-hari dan latihan soal.`,
    advanced: `Saya sedang belajar bahasa ${lang} tingkat lanjutan. Berikan materi kompleks dan latihan menerjemahkan.`
  };
  
  const fullPrompt = `${promptIntro[level] || promptIntro.beginner}\nPertanyaan/Pernyataan pengguna: ${m.text}\nJawab dalam bahasa ${lang} tanpa terjemahan.`;
  
  try {
    const { data } = await axios.get('https://fastrestapis.fasturl.cloud/aillm/gpt-4', {
      params: {
        ask: fullPrompt,
        sessionId: m.sender.replace(/[^0-9]/g, '')
      }
    });
    
    if (data && data.result) {
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
      m.reply(data.result);
    } else {
      throw 'Gagal mendapatkan balasan dari API';
    }
  } catch (e) {
    console.log(e);
    m.reply('Terjadi kesalahan saat menghubungi server pembelajaran.');
  }
};

handler.help = ['autolang [on/off/reset]', 'setlearnlang <kode_bahasa> <level>'];
handler.tags = ['belajar', 'ai'];
handler.command = /^(autolang|setlearnlang)$/i;

module.exports = handler;