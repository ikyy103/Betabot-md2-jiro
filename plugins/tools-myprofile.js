let PhoneNumber = require('awesome-phonenumber');
let levelling = require('../lib/levelling');
const { createHash } = require('crypto');

let handler = async (m, { conn }) => {
    let who = m.sender; // Mengambil ID pengirim pesan
    let pp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXIdvC1Q4WL7_zA6cJm3yileyBT2OsWhBb9Q&usqp=CAU';

    try {
        pp = await conn.profilePictureUrl(who, 'image');
    } catch (e) {
        // Jika tidak ada gambar profil, gunakan gambar default
    }

    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada di dalam database';

    let about = (await conn.fetchStatus(who).catch(console.error) || {}).status || '';
    let { name, pasangan, limit, exp, money, lastclaim, premiumDate, premium, registered, regTime, age, level, role } = global.db.data.users[who];
    let now = new Date() * 1;
    let { min, xp, max } = levelling.xpRange(level, global.multiplier);
    let username = conn.getName(who);
    let math = max - xp;
    let sn = createHash('md5').update(m.sender).digest('hex');
    let jodoh = pasangan ? `Berpacaran dengan @${pasangan.split`@`[0]}` : 'Jomblo';

    let str = `
┌─⊷ *PROFILE*
👤 • *Username:* ${username} ${registered ? '(' + name + ')' : ''} (@${who.split`@`[0]})
👥 • *About:* ${about ? about : 'Tidak ada'}
🏷 • *Status:* ${jodoh}
📞 • *Number:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
🔢 • *Serial Number:* ${sn}
🔗 • *Link:* https://wa.me/${who.split`@`[0]}
👥 • *Umur:* ${registered ? age : 'Tidak terdaftar'}
└──────────────

┌─⊷ *PROFILE RPG*
▢ *XP:* TOTAL ${exp} (${exp - min} / ${xp}) [${math <= 0 ? `Ready to *levelup*` : `${math} XP left to levelup`}]
▢ *Level:* ${level}
▢ *Role:* *${role}*
▢ *Limit:* ${limit}
▢ *Money:* ${money}
└──────────────

┌─⊷ *STATUS*
📑 • *Registered:* ${registered ? `Yes (${new Date(regTime).toLocaleString()})` : 'No'}
🌟 • *Premium:* ${premium ? 'Yes' : 'No'}
⏰ • *PremiumTime:* ${(premiumDate - now) > 1 ? msToDate(premiumDate - now) : '*Tidak diatur expired premium!*'}
${lastclaim > 0 ? `🕓 • *Last Claim:* ${new Date(lastclaim).toLocaleString()}` : ''}
└──────────────
`.trim();

    conn.sendFile(m.chat, pp, 'profile.jpg', str, m, { contextInfo: { mentionedJid: conn.parseMention(str) } });
};

handler.help = ['myprofile'];
handler.tags = ['info'];
handler.command = /^myprofile$/i;
handler.limit = true;
handler.group = true;

module.exports = handler;

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${days} Hari ${hours} Jam ${minutes} Menit`;
}