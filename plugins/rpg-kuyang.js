const kuyangRewards = {
  xp: { min: 500, max: 5000 },
  money: { min: 1000, max: 15000 },
  limit: { min: 1, max: 5 },
  rareItem: ["Gigi Kuyang", "Rambut Kuyang", "Kain Mistis"], // Item langka
};

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  const randomNumber = Math.random();
  
  // Tentukan hadiah
  const xp = Math.floor(Math.random() * (kuyangRewards.xp.max - kuyangRewards.xp.min + 1)) + kuyangRewards.xp.min;
  const money = Math.floor(Math.random() * (kuyangRewards.money.max - kuyangRewards.money.min + 1)) + kuyangRewards.money.min;
  const limit = Math.floor(Math.random() * (kuyangRewards.limit.max - kuyangRewards.limit.min + 1)) + kuyangRewards.limit.min;
  const rareItem = randomNumber > 0.9 ? kuyangRewards.rareItem[Math.floor(Math.random() * kuyangRewards.rareItem.length)] : null;

  // Update database user
  user.exp += xp;
  user.money += money;
  user.limit += limit;

  let rewardMessage = `
🎯 *Pemburu Kuyang!*
🌟 *Hadiah:*
  🪙 *XP:* +${xp}
  💵 *Money:* +${money}
  📊 *Limit:* +${limit}${rareItem ? `\n🎁 *Item Langka:* ${rareItem}` : ""}
`;

  if (rareItem) {
    user.inventory = user.inventory || [];
    user.inventory.push(rareItem);
  }

  // Kirim pesan hasil berburu
  conn.reply(m.chat, rewardMessage.trim(), m);
};

handler.help = ['pemburukuyang'];
handler.tags = ['rpg'];
handler.command = /^pemburukuyang$/i;
handler.register = true;
handler.group = true;

module.exports = handler;