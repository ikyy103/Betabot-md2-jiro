let usersInSession = {}; // Menyimpan user yang aktif dalam sesi perkenalan

// Fungsi memulai sesi perkenalan
function startIntroduction(bot, userId1, userId2) {
  if (usersInSession[userId1] || usersInSession[userId2]) {
    bot.sendMessage(userId1, 'Salah satu dari kalian sedang dalam sesi perkenalan lain.');
    bot.sendMessage(userId2, 'Salah satu dari kalian sedang dalam sesi perkenalan lain.');
    return;
  }

  // Memulai sesi
  usersInSession[userId1] = { partnerId: userId2, startTime: Date.now(), active: true };
  usersInSession[userId2] = { partnerId: userId1, startTime: Date.now(), active: true };

  bot.sendMessage(userId1, 'Sesi perkenalan dengan user lain telah dimulai! Anda memiliki waktu 24 jam untuk berkenalan.');
  bot.sendMessage(userId2, 'Sesi perkenalan dengan user lain telah dimulai! Anda memiliki waktu 24 jam untuk berkenalan.');
}