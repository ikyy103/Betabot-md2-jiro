const db = require('../database');

let handler = async (m, { conn, args, mentionedJid }) => {
    if (args.length < 2) {
        return m.reply('⚠ *Format Salah!*\nGunakan: .addlimitch <nomor/reply/tag> <jumlah>');
    }

    let target;
    let jumlah = parseInt(args[1]);

    if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('⚠ *Jumlah harus berupa angka positif!*');
    }

    if (m.quoted) {
        target = m.quoted.sender;
    } else if (mentionedJid.length) {
        target = mentionedJid[0];
    } else if (args[0]) {
        target = args[0] + '@s.whatsapp.net';
    } else {
        return m.reply('⚠ *Format Salah!*\nGunakan: .addlimitch <nomor/reply/tag> <jumlah>');
    }

    let userLimit = db.get(`limit_${target}`) || { count: 0, lastReset: new Date().getTime() };
    userLimit.count += jumlah; // Tambah limit sesuai input

    db.set(`limit_${target}`, userLimit);
    m.reply(`✅ *Limit Berhasil Ditambahkan!*\n\n👤 *User:* @${target.split('@')[0]}\n🔢 *Limit Baru:* ${userLimit.count}\n➕ *Ditambahkan:* ${jumlah}`, { mentions: [target] });
};

handler.help = ['addlimitch @user <jumlah>'];
handler.tags = ['owner'];
handler.command = /^(addlimitch)$/i;
handler.owner = true;

module.exports = handler;