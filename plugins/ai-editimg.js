const uploadImage = require('../lib/uploadImage.js');
const fetch = require('node-fetch');
const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw 'Masukkan teks yang ingin diproses!';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, '⏳ Sedang diproses, harap tunggu...', m);

        try {
            const img = await q.download?.();
            if (!img) throw new Error("Gagal mendownload gambar.");

            let out = await uploadImage(img);
            let encodedText = encodeURIComponent(text);
            let resultUrl = `https://fastrestapis.fasturl.cloud/aiimage/gemini?prompt=${encodedText}&imageUrl=${out}`;

            console.log("🔗 URL API:", resultUrl);

            let response = await axios.get(resultUrl, { responseType: 'arraybuffer' });

            console.log("✅ API Response:", response.status);

            let buff = response.data;

            await conn.sendMessage(
                m.chat,
                {
                    image: buff,
                    caption: `✅ *Proses selesai!*\n\n📌 *Prompt:* ${text}`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message || error);
            m.reply(`❌ Terjadi kesalahan: ${error.response?.data?.message || error.message || error}`);
        }
    } else {
        m.reply(`⚠️ Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = ['editimg'];
handler.tags = ['aiimage'];
handler.command = /^(geminiimage|editimg)$/i;
handler.register = true;
handler.limit = 2;

module.exports = handler;