let handler = async (m, { conn, usedPrefix, args }) => {
    let id = m.chat;
    conn.giveway = conn.giveway ? conn.giveway : {};
    if (!(id in conn.giveway)) {
        throw `_*Tidak ada GIVEAWAY berlangsung di grup ini!*_\n\n*${usedPrefix}mulaigiveaway* - untuk memulai giveaway`;
    }

    let rollCount = parseInt(args[0]) || 10; // Default 10 jika tidak ada jumlah roll
    if (isNaN(rollCount) || rollCount < 1) throw `_*Jumlah roll harus berupa angka dan minimal 1!*_`;

    let d = new Date();
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    let absen = conn.giveway[id][1];
    let winner = absen[Math.floor(Math.random() * absen.length)];
    let tag = `@${winner.split`@`[0]}`;
    
    // Animasi progress roll
    let progress = [];
    for (let i = 10; i <= 100; i += 10) {
        progress.push(`■□ ${i}%`);
    }
    progress[progress.length - 1] = '*Mendapatkan Pemenangnya*';

    let { key } = await conn.sendMessage(m.chat, { text: '*Mencari Pemenangnya...*' });

    for (let i = 0; i < Math.min(rollCount, progress.length); i++) {
        await sleep(1000);
        await conn.sendMessage(m.chat, { text: progress[i], edit: key });
    }

    return conn.reply(
        m.chat,
        `🎊 *CONGRATULATIONS* 🎉\n${tag} Kamu Pemenang Giveawaynya 🎉\n\nTanggal: ${date}\n————————————————————————\n_*Note:* Hapus giveaway setelah selesai dengan menulis *.hapusgiveaway*_`,
        m,
        { contextInfo: { mentionedJid: absen } }
    );
};

handler.help = ['rollgiveaway <jumlah_roll>'];
handler.tags = ['adminry', 'group'];
handler.command = /^(rolling|rollgiveaway|rollinggiveaway)$/i;
handler.admin = true;

module.exports = handler;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};