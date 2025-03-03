const { proto } = require('@adiwajshing/baileys');

let handler = async (m, { conn, args }) => {
    const channelId = '120363346775465288@newsletter'; // ID Saluran Friendly Sparks
    let user = m.sender;

    // Cek database pengguna
    if (!global.db.data.users[user]) {
        global.db.data.users[user] = { limitSendCh: 0, lastReset: 0 };
    }

    let userData = global.db.data.users[user];

    // Reset limit setiap jam 00:00 WIB
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let resetTime = today.getTime();

    if (userData.lastReset < resetTime) {
        userData.limitSendCh = 0;
        userData.lastReset = resetTime;
    }

    if (userData.limitSendCh >= 2) {
        return m.reply(`🚫 *Limit Habis!*\n\nAnda telah mencapai batas pengiriman pesan hari ini.\nSilakan tunggu hingga jam 00:00 WIB atau hubungi *Owner* untuk membeli limit tambahan.`);
    }

    let pesan = args.join(' ');
    if (!pesan) return m.reply('• *Contoh :* .sendch Halo semua!');

    const senderName = m.pushName || 'Tanpa Nama';
    const groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Pesan Pribadi';

    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(user, 'image');
    } catch {
        ppUrl = 'https://i.ibb.co/7WQ9jnh/default-profile.png'; // Jika PP tidak tersedia
    }

    // Format pesan dengan nama dan asal grup
    const messages = {
        extendedTextMessage: {
            text: `${pesan}`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelId,
                    newsletterName: '𝙳𝚒 𝚔𝚒𝚛𝚒𝚖 𝚘𝚕𝚎𝚑 𝚋𝚘𝚝',
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `𝙵𝚛𝚘𝚖: ${senderName}`,
                    body: `𝙶𝚛𝚘𝚞𝚙: ${groupName}`,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnailUrl: ppUrl,
                    sourceUrl: 'https://514d9eb7-47e0-4fcc-b670-620296928f31-00-1doov4w1jmdxs.pike.replit.dev/'
                }
            }
        }
    };

    const messageToChannel = proto.Message.encode(messages).finish();
    const result = {
        tag: 'message',
        attrs: { to: channelId, type: 'text' },
        content: [
            {
                tag: 'plaintext',
                attrs: {},
                content: messageToChannel
            }
        ]
    };

    // Kirim pesan ke saluran
    await conn.query(result);

    // Tambah limit user setelah sukses mengirim pesan
    userData.limitSendCh++;
    global.db.data.users[user] = userData;

    m.reply(`✅ *Pesan Berhasil Dikirim ke Saluran!*\n\n📩 *Pesan:* ${pesan}\n👤 *From:* ${senderName}\n🏠 *Asal Grup:* ${groupName}`);
};

// Menambahkan beberapa alias untuk perintah
handler.help = ['sendch', 'sendchannel'].map(v => v + ' <text>');
handler.tags = ['tools'];
handler.command = /^(sendch|sendchannel)$/i;
handler.owner = false;

module.exports = handler;