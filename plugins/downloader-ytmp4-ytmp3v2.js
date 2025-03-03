const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');
const { tmpdir } = require('os');
const path = require('path');

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const SUPPORTED_AUDIO_FORMATS = ["mp3", "m4a", "webm", "acc", "flac", "ogg", "wav"];
const SUPPORTED_VIDEO_QUALITIES = {
  low: "360",
  medium: "480",
  hd: "720",
  fullHd: "1080",
  hdHigh: "1440",
  ultraHd: "4k",
};

const ytdl = {
  request: async (url, format, quality) => {
    try {
      if (SUPPORTED_AUDIO_FORMATS.includes(format)) {
        const { data } = await axios.get(
          `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${url}`
        );
        return data;
      } else if (SUPPORTED_VIDEO_QUALITIES[quality]) {
        const { data } = await axios.get(
          `https://p.oceansaver.in/ajax/download.php?format=${SUPPORTED_VIDEO_QUALITIES[quality]}&url=${url}`
        );
        return data;
      } else {
        return { error: "Format atau kualitas tidak didukung." };
      }
    } catch (error) {
      return { error: `Error (request): ${error.message}` };
    }
  },

  convert: async (taskId) => {
    try {
      const { data } = await axios.get(
        `https://p.oceansaver.in/ajax/progress.php?id=${taskId}`
      );
      return data;
    } catch (error) {
      return { error: `Error (convert): ${error.message}` };
    }
  },

  repeatRequest: async (taskId) => {
    while (true) {
      try {
        const response = await ytdl.convert(taskId);
        if (response && response.download_url) {
          return response.download_url;
        }
      } catch (error) {
        console.error(`Error (repeatRequest): ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  },
};

// Handler WhatsApp Bot
let handler = async (m, { conn, text, args }) => {
  if (!args[0]) return m.reply("🚩 *Masukkan link YouTube yang ingin diunduh!*");
  let url = args[0];
  let format = args[1] || "mp3";
  let quality = args[2] || "hd";

  let response = await ytdl.request(url, format, quality);
  if (response.error) return m.reply(`❌ *Terjadi kesalahan:* ${response.error}`);

  m.reply("⏳ *Sedang memproses...*");

  let downloadLink = await ytdl.repeatRequest(response.id);
  if (!downloadLink) return m.reply("🚩 *Gagal mendapatkan link unduhan.*");

  try {
    let filePath = path.join(tmpdir(), `download.${format}`);
    let { data } = await axios.get(downloadLink, { responseType: "arraybuffer" });

    await writeFile(filePath, data);
    
    if (SUPPORTED_AUDIO_FORMATS.includes(format)) {
      await conn.sendMessage(m.chat, { audio: { url: filePath }, mimetype: "audio/mpeg" });
    } else {
      await conn.sendMessage(m.chat, { video: { url: filePath }, mimetype: "video/mp4" });
    }

    await unlink(filePath);
  } catch (error) {
    console.error(`Error saat mengunduh file: ${error.message}`);
    return m.reply("🚩 *Gagal mengirim file.*");
  }
};

handler.help = ["ytmp3v2", "ytmp4v2"];
handler.tags = ["downloader"];
handler.command = /^(ytmp3v2|ytmp4v2)$/i;

module.exports = handler;