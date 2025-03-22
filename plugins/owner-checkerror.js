/*
📌 Nama Fitur: Cek Eror
🏷️ Type : Plugin CJS
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
✍️ Create By ZenzXD
Thanks To: Rezaa ( Dari Takashi MD ) 
*/

const fs = require('fs');
const path = require('path');

let Fruatre = async (m, { conn }) => {
    let pluginFolder = './plugins';
    let errorList = [];

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ Folder plugins tidak ditemukan!');
    }

    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));

    for (let file of files) {
        try {

            let plugin = require(path.resolve(pluginFolder, file));
            if (typeof plugin.default !== 'function') {
                throw new Error('Export default bukan fungsi');
            }
        } catch (err) {
            errorList.push(`❌ ${file}: ${err.message}`);
        }
    }

    if (errorList.length === 0) {
        m.reply('✅ Semua fitur aman, tidak ada error!');
    } else {
        m.reply(`🚨 Ditemukan ${errorList.length} error pada fitur:\n\n` + errorList.join('\n'));
    }
};

Fruatre.help = ['checkerror'];
Fruatre.tags = ['owner'];
Fruatre.command = /^checkerror$/i;
Fruatre.rowner = true;

module.exports = Fruatre;