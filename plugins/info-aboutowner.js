let handler = async (m, { conn }) => {
    // Data informasi owner
    let namaOwner = 'Zephyr';
    let statusOwner = 'Owner Drakhole Official Group';
    let instagram = 'https://www.instagram.com/satriaonly2024';
    let youtube = 'https://www.youtube.com/@satriahubdeals';
    let tiktok = 'https://www.tiktok.com/@satriahubdeals';
    let whatsapp = 'https://wa.me/6281234567890';
    let thumbnailUrl = 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/qfruoz8d.jpg';

    // Salam berdasarkan waktu
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

    // Template pesan
    let aboutText = `
┌───〔 *Tentang Owner* 〕────
│
├ 👤 *Nama*: ${namaOwner}
├ 💼 *Status*: ${statusOwner}
│
┌───〔 *Media Sosial* 〕────
│
├ 📸 *Instagram* 
│   ↪ ${instagram}
│
├ 🎥 *YouTube*
│   ↪ ${youtube}
│
├ 🎶 *TikTok*
│   ↪ ${tiktok}
│
├ 📱 *WhatsApp*
│   ↪ ${whatsapp}
│
└───────────────────────

✨ *Selamat ${timeOfDay}!*  
Terima kasih telah menggunakan layanan ini.  
Jangan lupa untuk mendukung dan mengikuti akun media sosial owner agar bot ini bisa terus berkembang! 😊
`.trim();

    // Mengirim pesan dengan thumbnail
    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: aboutText,
            contextInfo: {
                externalAdReply: {
                    title: 'Informasi Owner',
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: instagram // Link utama (contoh: Instagram owner)
                }
            }
        }
    }, {});
};

handler.command = /^(aboutowner|ownerinfo)$/i;
handler.tags = ['info'];
handler.help = ['aboutowner'];

module.exports = handler;