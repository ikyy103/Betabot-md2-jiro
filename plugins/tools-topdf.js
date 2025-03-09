const { PDFDocument } = require("pdf-lib");

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`⚠️ Balas gambar dengan perintah *${usedPrefix + command}* untuk mengubahnya menjadi PDF.`);
    
    try {
        let mime = m.quoted.mimetype || "";
        if (!mime.startsWith("image/")) throw "⚠️ Format file tidak didukung! Hanya gambar (JPG/PNG) yang bisa dikonversi ke PDF.";

        let imgBuffer = await m.quoted.download();
        if (!imgBuffer) throw "⚠️ Gagal mengunduh gambar.";

        let pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595, 842]); // Ukuran A4
        let img = await pdfDoc.embedJpg(imgBuffer).catch(() => pdfDoc.embedPng(imgBuffer));

        let { width, height } = img.scaleToFit(550, 800);
        page.drawImage(img, { x: 20, y: 20, width, height });

        let pdfBytes = await pdfDoc.save();
        
        await conn.sendMessage(m.chat, { 
            document: Buffer.from(pdfBytes), 
            fileName: "converted.pdf", 
            mimetype: "application/pdf",
            caption: "*✅ Gambar berhasil dikonversi ke PDF!*"
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mengonversi gambar ke PDF!");
    }
};

handler.help = ['imgtopdf'];
handler.tags = ['tools'];
handler.command = ['imgtopdf', 'topdf'];

module.exports = handler;