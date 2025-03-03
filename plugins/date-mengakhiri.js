function endSession(bot, userId) {
  const session = usersInSession[userId];
  if (session) {
    bot.sendMessage(userId, 'Sesi perkenalan telah diakhiri.');
    bot.sendMessage(session.partnerId, 'Sesi perkenalan telah diakhiri oleh pasangan Anda.');

    // Menghapus data sesi
    delete usersInSession[userId];
    delete usersInSession[session.partnerId];
  } else {
    bot.sendMessage(userId, 'Tidak ada sesi perkenalan aktif yang dapat diakhiri.');
  }
}