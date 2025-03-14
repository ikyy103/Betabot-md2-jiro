const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan teks untuk e-book!\nGunakan format: .ebook Judul|Penulis|Isi e-book");

  let [judul, penulis, isi] = text.split("|");  
  if (!judul || !penulis || !isi) return m.reply("*Format tidak lengkap!*");  

  const canvasWidth = 800, canvasHeight = 1000;  
  const canvas = createCanvas(canvasWidth, canvasHeight);  
  const ctx = canvas.getContext('2d');  

  // Background
  ctx.fillStyle = "#f5f5dc";  
  ctx.fillRect(0, 0, canvas.width, canvas.height);  

  // Judul E-Book
  ctx.fillStyle = "#333";  
  ctx.font = "bold 30px Arial";  
  ctx.textAlign = "center";  
  ctx.fillText(judul.toUpperCase(), canvasWidth / 2, 100);  

  // Penulis
  ctx.font = "italic 20px Arial";  
  ctx.fillText(`By: ${penulis}`, canvasWidth / 2, 140);  

  // Isi E-Book
  ctx.fillStyle = "#000";  
  ctx.font = "16px Arial";  
  ctx.textAlign = "left";  
  let words = isi.split(" ");  
  let line = "";  
  let y = 200;  

  words.forEach((word) => {  
    let testLine = line + word + " ";  
    let testWidth = ctx.measureText(testLine).width;  
    if (testWidth > 700) {  
      ctx.fillText(line, 50, y);  
      line = word + " ";  
      y += 30;  
    } else {  
      line = testLine;  
    }  
  });  
  ctx.fillText(line, 50, y);  

  // Simpan gambar e-book
  const buffer = canvas.toBuffer("image/png");  
  const filePath = path.join(__dirname, "../tmp/ebook.png");  
  fs.writeFileSync(filePath, buffer);  

  await conn.sendMessage(m.chat, { image: { url: filePath }, caption: "📖 *E-Book yang kamu buat!*" }, { quoted: m });  

  fs.unlinkSync(filePath);
};

handler.help = ['ebook'];
handler.tags = ['tools'];
handler.command = /^(ebook|buatbuku)$/i;

module.exports = handler;