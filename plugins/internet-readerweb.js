let handler = async (m, { args }) => {
  if (args.length === 0) {
    return m.reply('Harap berikan URL yang valid!');
  }

  const url = args.join(' ');
  const apiUrl = `https://api.mistra.top/api/ai/agent/web-reader?url=${encodeURIComponent(url)}&language=id`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === 200) {
      const result = data.result;
      const metadata = data.data.metadata;
      const images = data.data.images.map(img => img.src).join('\n');

      let message = `
        📖 Analisis Data Website: ${metadata.title}
        📝 Deskripsi: ${metadata.description}
        🌐 Struktur Website: ${result}
        🖼️ Gambar: ${images ? images : 'Tidak ada gambar yang ditemukan'}
        🔗 Link Website: ${data.url}
      `;

      m.reply(message);
    } else {
      m.reply('Terjadi kesalahan saat mengambil data dari URL.');
    }
  } catch (err) {
    m.reply('Terjadi kesalahan dalam proses pengambilan data.');
  }
};

handler.help = ['readerweb', 'webreader'];
handler.tags = ['internet'];
handler.command = /^(readerweb|webreader)$/i;
module.exports = handler;