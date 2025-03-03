const axios = require("axios");

let handler = async (m, { conn }) => {
  try {
    const response = await axios.get("https://api.vreden.my.id/api/search/capcut?query=Trend%20viral");
    const data = response.data;

    if (!data.result || !data.result.media || data.result.media.length === 0) {
      return m.reply("Tidak ditemukan template CapCut yang sesuai.");
    }

    let template = data.result.media[0]; // Ambil template pertama (trend viral)
    let videoUrl = template.templates.url; // URL video template CapCut
    let title = template.templates.title; // Judul template
    let shortTitle = template.templates.short_title; // Judul singkat
    let creator = template.profile.username; // Username pembuat
    let fullName = template.profile.full_name; // Nama lengkap pembuat
    let usageCount = template.statistics.usage_count; // Jumlah penggunaan
    let likeCount = template.statistics.like_count; // Jumlah like
    let commentCount = template.statistics.comment_count; // Jumlah komentar
    let playCount = template.statistics.play_count; // Jumlah pemutaran

    let caption = `🎬 *CapCut Trend Viral*\n\n` +
                  `📌 *Judul*: ${shortTitle}\n` +
                  `📌 *tags*: ${title}\n` +
                  `👤 *Creator*: ${fullName} (@${creator})\n` +
                  `💾 *Digunakan*: ${usageCount} kali\n` +
                  `❤️ *Like*: ${likeCount}\n` +
                  `💬 *Komentar*: ${commentCount}\n` +
                  `▶️ *Diputar*: ${playCount} kali\n\n` +
                  `🔗 *Gunakan template*: https://www.capcut.net/sharevideo?template_id=${template.templates.id}`;

    // Kirim video template beserta informasi
    await conn.sendFile(m.chat, videoUrl, "capcut.mp4", caption, m);
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan dalam mengambil data.");
  }
};

handler.help = ["capcuttren"];
handler.tags = ["internet"];
handler.command = /^(capcuttren)$/i;

module.exports = handler;