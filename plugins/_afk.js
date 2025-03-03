let handler = m => m;

handler.before = async m => {
  let user = global.db.data.users[m.sender];
  const username = m.name || m.pushName;
  const id = m.sender || m.key.remoteJid;

  if (user.afk > -1) {
    let text = `
    _${user.registered ? user.name : conn.getName(m.sender)} (@${m.sender.replace(/@.+/, "")}) Kamu kembali dari AFK!_ 🎉
    ${user.afkReason ? 'Alasan: ' + user.afkReason : 'Tanpa alasan'}
    ⏰ Selama: ${clockString(new Date() - user.afk)}
    `.trim();

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: text,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: `📅 Kembali dari AFK`,
            body: `Selamat datang kembali!`,
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://files.catbox.moe/dibovv.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
          },
        },
        mentions: [m.sender],
      },
    }, {});

    user.afk = -1;
    user.afkReason = '';
  }

  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
  for (let jid of jids) {
    let user = global.db.data.users[jid];
    if (!user) continue;
    let afkTime = user.afk;
    if (!afkTime || afkTime < 0) continue;
    let reason = user.afkReason || 'tanpa alasan';

    let text = `
> *Jangan Tag Dia! ❌*

*Dia sedang AFK 💤*

👤 Username ⇩
> ${user.registered ? user.name : conn.getName(jid)} (@${jid.replace(/@.+/, "")})
📝 Alasan AFK ⇩
> ${reason}
⏰ Lama AFK ⇩
> ${clockString(new Date() - afkTime)}
    `.trim();

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: text,
        contextInfo: {
          mentionedJid: [jid],
          externalAdReply: {
            title: `🔔 Pemberitahuan AFK`,
            body: `${jid} sedang tidak dapat dihubungi.`,
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://files.catbox.moe/lt4283.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
          },
        },
        mentions: [jid],
      },
    }, {});
  }
  return true;
};

module.exports = handler;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}