const fs = require("fs");

let handler = async (m, { conn }) => {
   try {
      // Ambil data pengguna dari database global
      let userId = m.sender;
      let db = global.db.data.users;

      // Periksa apakah data pengguna ada
      if (!db[userId]) {
         return m.reply("❌ Data Anda tidak ditemukan dalam database!");
      }

      // Buat file JSON untuk data pengguna yang meminta
      let userData = JSON.stringify(db[userId], null, 2);
      let backupFileName = `UserData_${userId.replace(/[@.]/g, "_")}.json`;

      fs.writeFileSync(backupFileName, userData);

      // Kirim file backup ke pengguna
      const file = fs.readFileSync(`./${backupFileName}`);
      await conn.sendMessage(
         m.chat,
         {
            document: file,
            mimetype: "application/json",
            fileName: backupFileName,
            caption: "✅ Backup data Anda selesai. Silakan unduh file backup.",
         },
         { quoted: m }
      );

      // Hapus file setelah dikirim
      setTimeout(() => {
         if (fs.existsSync(`./${backupFileName}`)) {
            fs.unlinkSync(`./${backupFileName}`);
            m.reply("🗑 File backup telah dihapus dari server.");
         }
      }, 5000);
   } catch (error) {
      m.reply("❌ Terjadi kesalahan saat melakukan backup.");
      console.error(error);
   }
};

handler.help = ["backupdata"];
handler.tags = ["tools"];
handler.command = ["backupdata"];
handler.private = true;
handler.rowner = false; // Bisa digunakan semua user

module.exports = handler;