const JavaScriptObfuscator = require('javascript-obfuscator');

let handler = async (m, { conn, text, args }) => {
    if (!text) throw `[!] Masukkan teks yang ingin dienkripsi.\n\nContoh:\n!enc mudah console.log('Halo Dunia')`;

    let level = args[0]?.toLowerCase();
    let inputText = args.slice(1).join(' ');
    if (!level || !inputText) throw `[!] Format salah. Gunakan: !enc <level> <teks>\n\n*Level Kesulitan:*\n- mudah\n- sedang\n- sulit\n- hardcore\n- ultra`;

    // Konfigurasi level obfuscasi
    let options = {};
    switch (level) {
        case 'mudah':
            options = { compact: true, controlFlowFlattening: false };
            break;
        case 'sedang':
            options = { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 };
            break;
        case 'sulit':
            options = {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
            };
            break;
        case 'hardcore':
            options = {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.7,
                stringArray: true,
                stringArrayThreshold: 0.8,
            };
            break;
        case 'ultra':
            options = {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
                stringArray: true,
                stringArrayEncoding: ['rc4'],
                stringArrayThreshold: 1,
                splitStrings: true,
                splitStringsChunkLength: 5,
            };
            break;
        default:
            throw `[!] Level tidak valid. Pilih salah satu: mudah, sedang, sulit, hardcore, ultra.`;
    }

    try {
        let res = JavaScriptObfuscator.obfuscate(inputText, options);
        conn.reply(m.chat, `*Hasil Enkripsi (${level}):*\n\n\`\`\`${res.getObfuscatedCode()}\`\`\``, m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `[!] Terjadi kesalahan saat mengenkripsi teks: ${e.message}`, m);
    }
};

handler.help = ['enc <level> <teks>'];
handler.tags = ['tools'];
handler.command = /^enc$/i;

module.exports = handler;