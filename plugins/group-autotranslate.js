const axios = require('axios');

let handler = async (m, { conn, text }) => {
    conn.autotranslate = conn.autotranslate || {};
    conn.userLang = conn.userLang || {};

    if (!text) throw `*• Example:* .autotranslate *[on/off/lang_code]*\n\n📌 *Contoh:* \n- .autotranslate on (Mengaktifkan auto-translate)\n- .autotranslate off (Menonaktifkan auto-translate)\n- .autotranslate id (Set bahasa target: Indonesia)`;

    let userId = m.sender;

    if (text === "on") {
        conn.autotranslate[userId] = true;
        m.reply("[ ✅ ] Auto Translate Activated.");
    } else if (text === "off") {
        delete conn.autotranslate[userId];
        delete conn.userLang[userId];
        m.reply("[ ✅ ] Auto Translate Deactivated.");
    } else if (text.length === 2) {
        conn.userLang[userId] = text;
        m.reply(`[ ✅ ] Bahasa target diubah menjadi: ${text.toUpperCase()}`);
    } else {
        m.reply("[ ❌ ] Format tidak valid. Gunakan perintah dengan benar.");
    }
};

handler.before = async (m, { conn }) => {
    conn.autotranslate = conn.autotranslate || {};
    conn.userLang = conn.userLang || {};

    let userId = m.sender;
    if (!conn.autotranslate[userId]) return;
    if (!m.text || m.isBaileys || m.fromMe) return;

    // Mencegah terjemahan untuk perintah bot
    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    let targetLang = conn.userLang[userId] || "id"; // Default ke Bahasa Indonesia

    try {
        await conn.sendMessage(m.chat, { react: { text: `⏳`, key: m.key } });

        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/translate`;
        const params = {
            text: m.text,
            target: targetLang
        };

        const response = await axios.get(apiUrl, { params });

        console.log("API Response:", response.data);

        if (response.data && response.data.result && response.data.result.translatedText) {
            let translatedText = response.data.result.translatedText;
            let detectedLang = response.data.result.from;

            // Jika bahasa asli sudah sama dengan target, tidak diterjemahkan
            if (detectedLang === targetLang) return;

            await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
            m.reply(`*Terjemahan (${detectedLang} ➝ ${targetLang}):*\n${translatedText}`);
        } else {
            console.error("API Error: Response does not contain translatedText.");
            m.reply("[ ❌ ] Translation failed. Invalid response from API.");
        }
    } catch (error) {
        console.error("Translation Error:", error.message || error);
        m.reply("[ ❌ ] Translation failed. Please try again later.");
    }
};

handler.command = ['autotranslate'];
handler.tags = ["translate"];
handler.help = ['autotranslate'].map(a => a + " *[on/off/lang_code]*");

module.exports = handler;