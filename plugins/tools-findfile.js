const fs = require('fs');
const path = require('path');

let handler = async function (m, { text }) {
  if (!text) throw '❌ Format salah! Silakan masukkan cmd/file keyword yang ingin dicari.';

  let folderPath = '/home/container/plugins/'; // Ganti dengan path folder di mana file disimpan
  let cmd = text.trim();

  // Fungsi untuk mencari file berdasarkan cmd
  const findFileByCmd = (folderPath, cmd) => {
    let matchedFiles = [];
    const files = fs.readdirSync(folderPath);

    for (let file of files) {
      let fullPath = path.join(folderPath, file);

      if (fs.statSync(fullPath).isDirectory()) {
        // Rekursif jika ada folder
        matchedFiles = matchedFiles.concat(findFileByCmd(fullPath, cmd));
      } else if (file.includes(cmd)) {
        matchedFiles.push(file);
      }
    }
    return matchedFiles;
  };

  // Menjalankan pencarian file
  let matchedFiles = findFileByCmd(folderPath, cmd);

  if (matchedFiles.length === 0) {
    throw `⚠️ Tidak ada file yang ditemukan dengan keyword/cmd: *${cmd}*!`;
  }

  let result = `
🔍 *Hasil Pencarian File:*
- Cmd: *${cmd}*
- File Ditemukan: ${matchedFiles.length}

${matchedFiles.map((f, i) => `${i + 1}. ${f}`).join('\n')}
`.trim();

  m.reply(result);
};

handler.help = ['findfile <cmd>'];
handler.tags = ['tools'];
handler.command = /^(findfile|searchfile)$/i;

module.exports = handler;