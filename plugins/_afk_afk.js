let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.listAfk = conn.listAfk || {};
    let user = global.db.data.users[m.sender];
    user.afk = +new Date();
    user.afkReason = text;

    const username = m.name || m.pushName;
    const id = m.sender || m.key.remoteJid;

    conn.listAfk[m.chat] = conn.listAfk[m.chat]
        ? conn.listAfk[m.chat].some((user) => user.id === id)
            ? conn.listAfk[m.chat]
            : [...conn.listAfk[m.chat], { username, id }]
        : [{ username, id }];

    const funnyReasons = [
        "lagi berak 😂",
        "lagi makan kerupuk 🍪",
        "Lagi mandi", 
        "Lagi nonton drakor", 
        "Lagi sedih 😭😢", 
        "Lagi males", // Menambahkan koma yang hilang di sini
        "sedang berpetualang di alam mimpi 🌙",
        "lagi nonton drama korea 📺",
        "lagi nyari jodoh di internet 💘",
        "sedang menghitung bintang ⭐",
        "lagi berlatih jadi ninja 🥷"
    ];

    const randomReason = funnyReasons[Math.floor(Math.random() * funnyReasons.length)];
    let caption = `${user.registered ? user.name : conn.getName(m.sender)} (@${m.sender.replace(/@.+/, "")}) Sekarang lagi AFK\n\nDengan alasan ➠ ${text ? text : randomReason}`;

    // Pastikan untuk menggunakan fungsi yang benar untuk mengirim pesan
    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: `AFK`,
                    body: user.name || "Pengguna", // Mengganti 'name' dengan 'user.name'
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://files.catbox.moe/tnh3bm.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
                },
            },
            mentions: [m.sender],
        },
    }, {});
}

handler.help = ["afk [alasan]"];
handler.tags = ["main"];
handler.group = true;
handler.command = /^afk$/i;
handler.register = true;

module.exports = handler;