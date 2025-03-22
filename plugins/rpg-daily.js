const rewards = {
  exp: 9999,
  money: 49997979,
  potion: 5,
  limit: 20,
};
const cooldown = 79200000;

let handler = async (m, { conn, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply('❌ User data tidak ditemukan.');

  if (new Date() - user.lastclaim < cooldown) {
    let remainingTime = user.lastclaim + cooldown - new Date();
    let hours = Math.floor(remainingTime / 3600000);
    let minutes = Math.floor((remainingTime % 3600000) / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);
    
    return m.reply(
      `Kamu sudah mengklaim hadiah hari ini. Tunggu hingga cooldown selesai.\n\n⏱️ *Waktu tersisa:* ${hours} jam ${minutes} menit ${seconds} detik.`
    );
  }

  let text = "";
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    user[reward] += rewards[reward];

    // Gunakan emoticon jika tersedia, atau gunakan emoji default
    let emoji = (global.rpg && global.rpg.emoticon) ? global.rpg.emoticon(reward) : '🎁';
    text += `➠ ${emoji} ${reward}: ${rewards[reward]}\n`;
  }

  m.reply(
    `🎉 *Daily Reward Claimed!* 🎉\n\n${text.trim()}`
  );

  user.lastclaim = new Date() * 1;
};

handler.help = ["claim"];
handler.tags = ["xp"];
handler.command = /^(daily|claim)$/i;

handler.register = true;
handler.group = true;
handler.rpg = true;

module.exports = handler;