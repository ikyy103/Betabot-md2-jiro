let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let urlToDownload = text || (m.quoted && m.quoted.text);
  if (!urlToDownload) throw `Masukkan atau reply link Doodstream yang ingin diunduh`;

  try {
    let result = await doodS(urlToDownload);
    let message = `
      ✅ *Download Link Doodstream*
      📌 Judul: ${result.title}
      📸 Preview: ${result.previewImage ? result.previewImage : 'Tidak tersedia'}
      🔗 Link Download: ${result.downloadLink}
    `;
    m.reply(message);
  } catch (error) {
    m.reply("🚨 Terjadi kesalahan saat mengambil data!");
  }
};

handler.help = ['dood <link>'];
handler.tags = ['downloader'];
handler.command = /^dood$/i;
handler.limit = true;
module.exports = handler;

const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

async function doodS(url) {
  try {
    const formData = new FormData();
    formData.append("video_url", url);
    const headers = { headers: { ...formData.getHeaders() } };
    const { data } = await axios.post("https://grabnwatch.com/doods.pro", formData, headers);
    const $ = cheerio.load(data);
    const videoTitle = $("#preview p.h5").text().trim();
    const previewImage = $("#preview img.make-it-fit").attr("src");
    const downloadLink = $("#result a").attr("href");
    return {
      title: videoTitle || "No title found",
      previewImage: previewImage ? `https://img.doodcdn.co${previewImage}` : null,
      downloadLink: downloadLink ? `https://grabnwatch.com${downloadLink}` : null
    };
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
}