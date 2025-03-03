const axios = require('axios');
const PASTEBIN_API_KEY = 'oabWY8rYf1DIWmS6DiSlvg0czLYsphE2'; // API Key Dev Pastebin

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Harap masukkan kode yang ingin diunggah ke Pastebin!');
  await conn.sendMessage(m.chat, { text: wait }, { quoted: m });

  try {
    const data = {
      api_dev_key: PASTEBIN_API_KEY,
      api_option: 'paste',
      api_paste_code: text,
      api_paste_private: '0', // 1 = Unlisted, 0 = Public, 2 = Private
      api_paste_name: wm,
      api_paste_expire_date: 'N',
      api_paste_format: 'javascript'
    };

    const res = await axios.post('https://pastebin.com/api/api_post.php', new URLSearchParams(data));
    const pasteUrl = res.data;
    const message = `✅ Kode berhasil diunggah ke Pastebin dan tidak akan pernah kedaluwarsa!\n\n🌐 URL: ${pasteUrl}\n\nSilakan buka link di atas untuk melihat kode Anda.`;

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });

  } catch (error) {
    console.error('Error saat mengunggah ke Pastebin:', error.message);
    await conn.sendMessage(m.chat, { text: `❗ Gagal mengunggah ke Pastebin: ${error.message}` }, { quoted: m });
  }
};
handler.help = ['uppastebin'];
handler.tags = ['tools'];
handler.command = /^(topastebin|uppastebin)$/i;
handler.owner = false;
handler.limit = true
module.exports = handler;