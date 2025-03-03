let handler = async (m, { text }) => {
  if (!text) {
    return m.reply('❌ *Harap masukkan kata kunci untuk mencari di Twitter/X!*');
  }

  // Encode kata kunci untuk URL
  let query = encodeURIComponent(text);
  let url = `https://x.com/search?q=${query}&src=typed_query`;

  // Kirim pesan ke user
  let message = `🔎 *Hasil Pencarian Twitter/X*\n\n` +
                `• Kata Kunci: *${text}*\n` +
                `• Link Pencarian: ${url}\n\n` +
                `Klik link di atas untuk melihat hasilnya di Twitter/X.`;

  m.reply(message);
};

handler.help = ['twitsearch <kata kunci>'];
handler.tags = ['search'];
handler.command = /^(twitsearch|twittersearch)$/i;

module.exports = handler;