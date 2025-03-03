let handler = async (m, { conn, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply("Data pengguna tidak ditemukan.");

  let __timers = new Date() - (user.lastmisi || 0); // Pastikan lastmisi terdefinisi
  let _timers = 3600000 - __timers; // Hitung waktu sisa
  if (_timers < 0) _timers = 0; // Hindari nilai negatif

  let timers = clockString(_timers);
  let name = user.registered ? user.name : conn.getName(m.sender);
  let id = m.sender;
  let kerja = "roket";

  conn.misi = conn.misi ? conn.misi : {};
  if (id in conn.misi)
    return conn.reply(
      m.chat,
      `Selesaikan misi ${conn.misi[id][0]} terlebih dahulu`,
      m,
    );

  if (user.healt < 80) return m.reply("Anda harus memiliki minimal 80 health.");

  if (_timers === 0) {
    // Misi roket bisa dijalankan
    let ngerok4 = Math.floor(Math.random() * 10);
    let ngerok5 = Math.floor(Math.random() * 10);

    let ngrk4 = ngerok4 * 100000;
    let ngrk5 = ngerok5 * 1000;

    let hsl = `
*—[ Hasil Ngroket ${name} ]—*
➕ 💹 Uang = [ ${ngrk4} ]
➕ ✨ Exp = [ ${ngrk5} ]
➕ 😍 Mendarat Selesai = +1
➕ 📥 Total Mendarat Sebelumnya : ${user.roket || 0}
> 💸 Money kamu saat ini : ${user.money}
> —> health kamu saat ini : ${user.healt}
`.trim();

    user.money = (user.money || 0) + ngrk4;
    user.exp = (user.exp || 0) + ngrk5;
    user.roket = (user.roket || 0) + 1;
    user.health -= 80;

    // Pastikan user.title dan user.titlelist ada
    if (typeof user.title !== "string") {
      user.title = "";
    }
    if (!Array.isArray(user.titlelist)) {
      user.titlelist = [];
    }

    if (user.roket >= 100 && user.title !== "100x menyelesaikan roket") {
      if (user.title) {
        user.titlelist.push(user.title);
      }
      user.title = "100x menyelesaikan roket";
      user.legendary = (user.legendary || 0) + 30000000; // Tambahkan 30 juta uang
      conn.reply(
        m.chat,
        `🎉 Selamat ${name}, Anda telah menyelesaikan misi roket sebanyak 100 kali, mendapatkan title "100x menyelesaikan roket" dan hadiah tambahan sebesar 30 juta!`,
        m,
      );
    }

    setTimeout(() => {
      conn.reply(m.chat, `🔍 ${name} memulai penerbangan...`, m);
    }, 0);

    conn.misi[id] = [
      kerja,
      setTimeout(() => {
        delete conn.misi[id];
      }, 27000),
    ];

    setTimeout(() => {
      conn.reply(m.chat, hsl, m);
    }, 27000);

    user.lastmisi = new Date() * 1;
  } else {
    // Waktu cooldown belum selesai
    m.reply(`Silahkan menunggu selama ${timers}, untuk bisa ${kerja} kembali.`);
  }
};
handler.help = ["roket"];
handler.tags = ["rpg"];
handler.command = /^(roket|ngroket|groket|jadiroket)$/i;
handler.register = true;
handler.group = true;
handler.level = 10;
handler.rpg = true;
module.exports = handler;

function clockString(ms) {
  if (ms <= 0) return "00:00:00"; // Tangani nilai negatif atau nol
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}