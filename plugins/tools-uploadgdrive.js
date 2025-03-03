const uploadFile = require('./lib/uploadDrive.js');

var handler = async (m, { conn, usedPrefix, args }) => {
    if (!m.quoted || !m.quoted.message) throw 'Reply ke file yang ingin diunggah!';
    
    let file = await conn.downloadMediaMessage(m.quoted);
    let filePath = `./temp/${Date.now()}.file`;
    
    fs.writeFileSync(filePath, file);

    try {
        let result = await uploadFile(filePath);
        m.reply(`✅ *File berhasil diunggah ke Google Drive!*\n\n📂 *ID File:* ${result.id}\n🔗 *View:* ${result.viewLink}\n⬇️ *Download:* ${result.downloadLink}`);
    } catch (e) {
        m.reply(`❌ Gagal mengunggah file! ${e.message}`);
    }

    fs.unlinkSync(filePath);
};

handler.command = ['uploadgdrive'];
handler.tags = ['tools'];
handler.help = ['uploadgdrive'];
module.exports = handler;