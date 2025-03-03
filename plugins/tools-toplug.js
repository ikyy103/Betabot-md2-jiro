let handler = async (m, { conn, text, usedPrefix, command }) => {
    let codeToConvert = text || (m.quoted && m.quoted.text);

    if (!codeToConvert) throw `⚠️ *Masukkan atau reply kode yang ingin diubah ke format plugin!*`;

    let result = convertToPlugin(codeToConvert);
    
    m.reply(result);
};

handler.help = ['toplug <kode>'];
handler.tags = ['code'];
handler.command = /^toplug$/i;
handler.limit = true;

module.exports = handler;

// **Fungsi Konversi ke Plugin**
function convertToPlugin(code) {
    return `let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    ${code}
};

handler.help = ['toplug'];
handler.tags = ['tools'];
handler.command = /^toplug$/i;
handler.limit = true;

module.exports = handler;`;
}