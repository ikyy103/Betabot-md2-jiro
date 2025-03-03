const handlerSetIntro = async (m, { conn, args }) => {
    const command = args[0]?.toLowerCase();
    const user = global.db.data.users[m.sender];

    if (command === 'set') {
        const [field, ...value] = args.slice(1);
        if (!field || !value.length) {
            return conn.reply(m.chat, `❌ Format salah! Gunakan *!setintro set <field> <value>*\n\n📜 *Field yang tersedia:*\n- nama\n- gender\n- umur\n- hobby\n- kelas\n- asal\n- agama\n- status\n\nAnda juga dapat menambahkan field baru!`, m);
        }

        // Perbarui data intro
        user[field] = value.join(' ');
        conn.reply(m.chat, `✅ *${field}* berhasil diperbarui menjadi:\n_${user[field]}_`);
        return;
    }

    if (command === 'reset') {
        // Reset data intro
        delete user.nama;
        delete user.gender;
        delete user.umur;
        delete user.hobby;
        delete user.kelas;
        delete user.asal;
        delete user.agama;
        delete user.status;

        conn.reply(m.chat, `✅ Semua data intro telah direset!`);
        return;
    }

    conn.reply(m.chat, `❓ Gunakan perintah berikut:\n\n- *!setintro set <field> <value>* untuk mengatur data intro.\n- *!setintro reset* untuk menghapus semua data intro.`);
};

// Respons otomatis berdasarkan kata kunci
const keywords = ['intro', 'kenalan', 'halo']; // Kata kunci relevan
const responses = [
    '👋 Hai! Jangan lupa kenalan ya!',
    '😊 Selamat datang! Yuk kenalan dulu!',
    '📜 Isi kartu intro kamu dengan perintah *!setintro set*'
];

handlerSetIntro.all = async (m, { conn }) => {
    const messageText = m.text.toLowerCase();
    if (keywords.some(keyword => messageText.includes(keyword))) {
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

handlerSetIntro.command = /^setintro$/i;
handlerSetIntro.help = ['setintro set <field> <value>', 'setintro reset'];
handlerSetIntro.tags = ['group','tools'];
handlerSetIntro.group = true;

module.exports = handlerSetIntro;