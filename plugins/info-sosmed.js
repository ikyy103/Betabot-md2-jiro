let handler = async (m, { conn, usedPrefix }) => {
    let sig = 'https://www.instagram.com/@satriaonly2024';
    let sgh = 'https://github.com/satriahubdeals';
    let sfb = 'Belum tersedia';
    let stt = 'https://www.tiktok.com/@botwhatsappinfo?_t=ZS-8vRNkRvQerw&_r=1';
    let stt2 = 'https://www.tiktok.com/@jirobriliance?_t=ZS-8vRNmwRPqL7&_r=1';
    let stele = 't.me/@Satriaonly2024';
    let syt = 'https://www.youtube.com/@satriahubdeals';
    let today = new Date();
    let curHr = today.getHours();
    let timeOfDay;

    if (curHr < 12) {
        timeOfDay = 'pagi';
    } else if (curHr < 18) {
        timeOfDay = 'siang';
    } else {
        timeOfDay = 'malam';
    }

    let payText = `
┌─── 〔 *Media Sosial* 〕 ────
│
├ *Selamat ${timeOfDay} Kak 🌞🌛*
│
├ 🌟 *Instagram*
│    ↪ ${sig}
│
├ 💻 *GitHub*
│    ↪ ${sgh}
│
├ 👤 *Facebook*
│    ↪ ${sfb}
│
├ 🎥 *YouTube*
│    ↪ ${syt}
│
├ 🎥 *TELEGRAM*
│    ↪ ${stele}
│
├ 🎶 *TikTok*
│    ↪ ${stt}
│    ↪ ${stt2}
│
├ 📱 *WhatsApp*
│    ↪ wa.me/${global.numberowner}
│
└───────────────────────

✨ *Pesan dari Developer:*
Ini adalah akun media sosial kami. Jangan ragu untuk mengunjungi, mengikuti, dan mendukung perkembangan bot ini. Saran dan masukan Anda sangat berharga bagi kami untuk memberikan layanan yang lebih baik. Terima kasih atas dukungannya! 😊
    `.trim();

    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: payText,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: 'Media Sosial Developer',
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/qfruoz8d.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w'
                }
            },
            mentions: [m.sender]
        }
    }, {});
};

handler.command = /^(sosmed)$/i;
handler.tags = ['info'];
handler.help = ['sosmed'];

module.exports = handler;