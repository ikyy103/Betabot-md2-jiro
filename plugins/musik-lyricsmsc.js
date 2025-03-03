let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw 'Berikan teks untuk mencari lagu!';

  try {
    // Mengambil data dari API
    const response = await fetch(`https://fastrestapis.fasturl.cloud/music/songlyrics-v1?text=${encodeURIComponent(text)}`);
    const data = await response.json();

    // Memeriksa status respons
    if (data.status !== 200 || data.result.answer.lyrics === 'no') {
      throw 'Lagu tidak ditemukan!';
    }

    // Mengambil URL audio preview
    const audioUrl = data.result.answer.preview_audio_url;

    // Mengirimkan audio
    await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
  } catch (e) {
    throw 'Terjadi kesalahan: ' + e.message;
  }
}

handler.command = handler.help = ['lyricsmsc'];
handler.tags = ['music'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;
module.exports = handler;