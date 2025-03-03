const axios = require('axios');

let handler = async (m, { conn, text }) => {
    let [option, inputLanguage, outputLanguage, ...codeArray] = text.split('|');
    let inputCode = codeArray.join('|').trim();

    if (!option || !inputLanguage || !outputLanguage || !inputCode) {
        return m.reply("❌ *Format salah!*\nGunakan: `.convert <opsi>|<bahasa_asal>|<bahasa_tujuan>|<kode>`");
    }

    // Validasi opsi
    const validOptions = ['convert', 'debug', 'ask', 'optimize', 'explain'];
    if (!validOptions.includes(option.toLowerCase())) {
        return m.reply("❌ *Opsi tidak valid! Pilih antara: convert, debug, ask, optimize, explain.*");
    }

    try {
        // 🔄 Kirim permintaan ke API Fast Rest AIExperience
        let apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/coder?inputLanguage=${encodeURIComponent(inputLanguage)}&outputLanguage=${encodeURIComponent(outputLanguage)}&inputCode=${encodeURIComponent(inputCode)}&option=${option}&language=English`;
        let response = await axios.get(apiUrl);

        if (!response.data || response.data.status !== 200 || !response.data.result) {
            return m.reply("⚠️ *Gagal memproses permintaan! API mungkin sedang down.*");
        }

        let resultCode;
        switch (option.toLowerCase()) {
            case 'convert':
                resultCode = response.data.result.converted_code;
                break;
            case 'debug':
                resultCode = response.data.result.debugged_code;
                break;
            case 'ask':
                resultCode = response.data.result.answer;
                break;
            case 'optimize':
                resultCode = response.data.result.optimized_code;
                break;
            case 'explain':
                resultCode = response.data.result.explanation;
                break;
        }

        // 📤 Kirim hasil
        await conn.sendMessage(m.chat, { text: `🎯 *Hasil untuk opsi ${option} dari ${inputLanguage} ke ${outputLanguage}:*\n\`\`\`${resultCode}\`\`\`` }, { quoted: m });

    } catch (error) {
        console.error("❌ Error Fetching Data:", error);
        m.reply("⚠️ *Terjadi kesalahan saat mengambil data! Coba lagi nanti.*");
    }
};

handler.help = ['zepcode <opsi>|<bahasa_asal>|<bahasa_tujuan>|<kode>'];
handler.tags = ['tools'];
handler.command = /^zepcode$/i;

module.exports = handler;