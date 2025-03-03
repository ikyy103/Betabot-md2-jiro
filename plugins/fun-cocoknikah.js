let handler = async (m, { conn, text, participants }) => {
  let users = Object.entries(global.db.data.users).filter(([key, value]) => value.registered);
  let user = global.db.data.users[m.sender];

  if (!user.registered) throw `❌ Anda belum terdaftar! Daftar terlebih dahulu menggunakan perintah *!daftar*.`;

  let compatibleUsers = users.filter(([key, value]) => 
    key !== m.sender && // Bukan dirinya sendiri
    value.agama === user.agama && // Agama sama
    Math.abs((new Date().getFullYear() - value.tahunLahir) - (new Date().getFullYear() - user.tahunLahir)) <= 5 // Selisih umur maksimal 5 tahun
  );

  if (compatibleUsers.length === 0) {
    return m.reply(`❌ Tidak ada pasangan yang cocok untuk Anda berdasarkan agama dan umur.`);
  }

  let chosen = compatibleUsers[Math.floor(Math.random() * compatibleUsers.length)];
  let [id, data] = chosen;

  let umurAnda = new Date().getFullYear() - user.tahunLahir;
  let umurPasangan = new Date().getFullYear() - data.tahunLahir;

  let result = `
❤️ *Pasangan yang Sangat Cocok* ❤️

👤 *Nama Anda*: ${user.name}
🛐 *Agama*: ${user.agama}
🎂 *Umur*: ${umurAnda} tahun

🔗 *Pasangan Anda*:
👤 *Nama*: ${data.name}
🏷 *Tag*: @${id.split`@`[0]}
🛐 *Agama*: ${data.agama}
🎂 *Umur*: ${umurPasangan} tahun

Semoga berjodoh dan bahagia selalu! 😊
`.trim();

  conn.reply(m.chat, result, m, {
    mentions: [id]
  });
};

handler.help = ['cocoknikah'];
handler.tags = ['fun'];
handler.command = /^cocoknikah$/i;

module.exports = handler;