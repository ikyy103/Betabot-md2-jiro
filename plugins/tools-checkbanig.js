const axios = require('axios');

let handler = async (m) => {
  let username = m.text.split(' ')[1]; // Mengambil username dari pesan
  if (!username) {
    return m.reply('Silakan masukkan username yang ingin diperiksa.');
  }

  try {
    const response = await axios.get(`https://devo.apibotwa.biz.id/api/tools/showban?username=${username}`);
    const data = response.data;

    if (data.banned) {
      m.reply(`
Pengguna *${username}* sedang dibanned!
Alasan: ${data.reason || 'Tidak ada alasan yang diberikan'}
Tanggal Banned: ${data.banDate || 'Tidak ada informasi tanggal'}
      `.trim());
    } else {
      m.reply(`Pengguna *${username}* tidak dibanned.`);
    }
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat memeriksa status banned. Silakan coba lagi nanti.');
  }
}

handler.help = ['checkbanig <username>'];
handler.tags = ['tools'];

handler.command = /^checkbanig$/i;

module.exports = handler;