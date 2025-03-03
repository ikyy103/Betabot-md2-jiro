let handler = async (m, { conn, isOwner, text }) => {
    if (!text) throw 'Masukkan user/id grup yang ingin di ban dan durasi waktu ban dalam menit.\n\nExample: .bantimer 6282361160044 60 atau .bantimer 2837372829@g.us 30';
  
    let [target, duration] = text.split(' ');
    if (!target || !duration) throw 'Format salah. Gunakan: .bantimer [id user/grup] [durasi dalam menit]';

    let who;
    if (m.isGroup) {
        if (isOwner) {
            who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : target.includes('@g.us') ? target : `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        } else {
            who = m.chat;
        }
    } else {
        if (!isOwner) {
            global.dfail('owner', m, conn);
            throw false;
        }
        who = target.includes('@g.us') ? target : `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    }

    let banDuration = parseInt(duration) * 60 * 1000; // Konversi menit ke milidetik
    if (isNaN(banDuration) || banDuration <= 0) throw 'Durasi ban harus berupa angka positif (dalam menit).';

    try {
        let now = Date.now();

        // Banned grup atau user
        if (who.endsWith('g.us')) {
            global.db.data.chats[who].isBanned = true;
            global.db.data.chats[who].banExpires = now + banDuration; // Waktu habis ban
        } else {
            global.db.data.users[who].banned = true;
            global.db.data.users[who].banExpires = now + banDuration; // Waktu habis ban
        }

        m.reply(`✅ Berhasil banned ${await conn.getName(who)} selama ${duration} menit.`);

        // Set timeout untuk otomatis menghapus ban
        setTimeout(() => {
            if (who.endsWith('g.us')) {
                global.db.data.chats[who].isBanned = false;
                global.db.data.chats[who].banExpires = null;
            } else {
                global.db.data.users[who].banned = false;
                global.db.data.users[who].banExpires = null;
            }
            conn.reply(who, `⏰ Waktu banned Anda telah habis. Anda sekarang dapat menggunakan bot kembali.`, null);
        }, banDuration);

    } catch (e) {
        throw `❌ Error: Nomor atau ID tidak ditemukan dalam database!`;
    }
};

handler.help = ['bantimer'];
handler.tags = ['owner'];
handler.command = /^bantimer$/i;

handler.owner = true;

module.exports = handler;