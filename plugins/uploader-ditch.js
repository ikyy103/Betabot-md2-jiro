const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

async function fileDitch(path) {
  try {
    let form = new FormData();
    form.append("files[]", fs.createReadStream(path));

    let upload = await axios.post("https://up1.fileditch.com/upload.php", form, {
      headers: { 
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0"
      }
    });

    let res = await axios.get(upload.data.files[0].url, { headers: { "User-Agent": "Mozilla/5.0" } });
    let $ = cheerio.load(res.data);
    let url = $("a.download-button").attr("href");

    return url;
  } catch (err) {
    throw Error("⚠️ Gagal mengupload file: " + err.message);
  }
}

let handler = async (m, { conn, usedPrefix, command, quoted }) => {
  if (!quoted || !quoted.message || !quoted.message.documentMessage) {
    return m.reply(`📌 *Gunakan format:*\nBalas file yang ingin diupload dengan perintah:\n${usedPrefix + command}`);
  }

  let media = await conn.downloadAndSaveMediaMessage(quoted);
  let fileUrl;

  try {
    fileUrl = await fileDitch(media);
  } catch (err) {
    return m.reply(err.message);
  } finally {
    fs.unlinkSync(media); // Hapus file setelah diupload
  }

  m.reply(`✅ *File berhasil diupload!*\n📎 Link: ${fileUrl}`);
};

handler.help = ["ditch"];
handler.tags = ["tools","uploader"];
handler.command = /^(ditch)$/i;
handler.register = true;

module.exports = handler;