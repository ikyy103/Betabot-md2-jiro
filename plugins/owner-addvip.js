const { MessageType } = require('@adiwajshing/baileys').default;

let handler = async (m, { conn, text, usedPrefix }) => {
  function no(number){
    return number.replace(/\s/g, '').replace(/([@+-])/g, '');
  }

  if (!text) return conn.reply(m.chat, `*『 GAGAL 』*\n\n• ${usedPrefix}addvip @tag/nomor|days|poin\n*Contoh:* ${usedPrefix}addvip 6285764068784|30|500`, m);

  let hl = text.split('|').map(n => no(n.trim()));
  if (hl.length < 3) return conn.reply(m.chat, `Format salah! Contoh: ${usedPrefix}addvip 6285764068784|30|500`, m);

  let userId = hl[0] + "@s.whatsapp.net";
  let days = parseInt(hl[1]);
  let points = parseInt(hl[2]);

  if (!db.data.users[userId]) throw 'Pengguna belum terdaftar dalam database!';

  let now = new Date() * 1;
  let duration = 86400000 * days; 

  db.data.users[userId].vip = 'aktif';
  db.data.users[userId].vipPoin = (db.data.users[userId].vipPoin || 0) + points;
  db.data.users[userId].vipTime = now + duration;

  conn.reply(m.chat, `*『 Sukses! 』*\n\nBerhasil menambahkan akses VIP kepada *@${hl[0]}* selama *${days} hari* dan *${points} VIP Poin*!`, m, { contextInfo: { mentionedJid: [userId] } });
  conn.reply(userId, `*『 INFO VIP 』*\n\nKamu sekarang VIP selama *${days} hari* dan mendapatkan *${points} VIP Poin*!`, m);
};

handler.help = ['addvip *@tag|days|poin*'];
handler.tags = ['owner'];
handler.command = /^(addvip)$/i;
handler.owner = true;

module.exports = handler;