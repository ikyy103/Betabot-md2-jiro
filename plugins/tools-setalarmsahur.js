let handler = async (m, { text }) => {
    if (!text) return m.reply('⏰ *Gunakan format:* .setalarmsahur 04:00');

    let [hour, minute] = text.split(':');
    if (isNaN(hour) || isNaN(minute)) return m.reply('⚠️ *Format salah! Gunakan contoh:* .setalarmsahur 04:00');

    let time = `${hour}:${minute}`;
    let alarmUrl = `https://vclock.com/#time=${hour}:${minute}&title=Bangun+Waktunya+Sahur&enabled=1&sound=classic&loop=1`;

    let message = `✅ succes!!!\n\n*Klik link berikut untuk mengatur Alarm Sahur secara otomatis:*\n\n🔗 Alarm Sahur Link : https://vclock.com/#time=${hour}:${minute}&title=Bangun+Waktunya+Sahur&enabled=1&sound=classic&loop=4\n\n📌 *Jam:* ${time} WIB\n\n© *Created By Bot Zephyr*`;

    m.reply(message);
};

handler.help = ['setalarmsahur <jam:menit>'];
handler.tags = ['islam', 'tools'];
handler.command = /^(setalarmsahur)$/i;

module.exports = handler;