let handler = async (m, { conn }) => {
    const keywords = ['terima kasih', 'thank you', 'thanks', 'makasih'];
    const responses = [
        'Sama-sama! 😊',
        'Sama-sama, semoga harimu menyenangkan!',
        'Tidak masalah, selalu siap membantu!',
       'Thanks you more baby',
        'Kembali kasih! 😄',
       'no problem👍',
        'Sama-sama, ada lagi yang bisa dibantu?'
    ];

    // Cek apakah pesan mengandung salah satu kata kunci
    const messageText = m.text.toLowerCase(); // Ambil teks pesan dan ubah ke huruf kecil
    if (keywords.some(keyword => messageText.includes(keyword))) {
        // Jika ada kecocokan, kirim salah satu respons secara acak
        const response = responses[Math.floor(Math.random() * responses.length)];
        await conn.sendMessage(m.chat, {
            text: response,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363289292848528@newsletter',
                    serverMessageId: -1,
                    newsletterName: "Zephyr By Drakhole official"
                }
            }
        }, {
            quoted: m
        });
    }
};

handler.customPrefix = /terima kasih|thank you|thanks|makasih/i;
handler.command = new RegExp;

module.exports = handler;