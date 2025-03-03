let handler = async (m, { conn, args }) => {
   try {
      // Validasi input
      if (!args[0]) {
         return m.reply("❌ Silakan cantumkan nomor penerima notifikasi backup.\n\nContoh:\n`.backupdata 6281234567890`");
      }

      let targetNumber = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"; // Format nomor
      let userId = m.sender;
      let userData = global.db.data.users[userId];

      if (!userData) {
         return m.reply("❌ Data Anda tidak ditemukan di database.");
      }

      // Buat data backup dalam format JSON
      let backupData = JSON.stringify(userData, null, 2);

      // Kirim data backup ke pengguna
      m.reply("✅ Data Anda berhasil dibackup! Silakan simpan data berikut dengan aman:\n\n```" + backupData + "```");

      // Kirim notifikasi ke nomor target
      conn.sendMessage(targetNumber, {
         text: `📤 *Notifikasi Backup Data*\n\nBackup data pengguna berhasil dilakukan.\n\n📋 *Detail Backup:*\n- Nomor: ${m.sender.split("@")[0]}\n- Data: \n\`\`\`${backupData}\`\`\`\n\n✨ Silakan cek data ini dan simpan dengan aman.`,
         mentions: [m.sender],
      });

      m.reply("✅ Notifikasi backup berhasil dikirim ke nomor: " + args[0]);
   } catch (error) {
      console.error("❌ Terjadi kesalahan saat backup data:", error);
      m.reply("❌ Terjadi kesalahan saat melakukan backup. Silakan coba lagi.");
   }
};

handler.help = ["backupdatanomor <nomor>"];
handler.tags = ["tools"];
handler.command = ["backupdatanomor"];
handler.rowner = false;

module.exports = handler;