const fs = require("fs");

let handler = async (m, { conn, args }) => {
   try {
      // Periksa apakah nomor diberikan
      if (!args[0]) throw "❌ Masukkan nomor telepon untuk mengambil data user. Contoh: *.bdm 6281234567890*";

      // Format nomor telepon menjadi ID WhatsApp
      let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

      // Ambil data pengguna dari database global
      let db = global.db.data.users;

      // Periksa apakah data pengguna ada
      if (!db[number]) {
         return m.reply(`❌ Data dengan nomor ${args[0]} tidak ditemukan dalam database!`);
      }

      // Buat file JSON untuk data pengguna
      let userData = JSON.stringify(db[number], null, 2);
      let backupFileName = `UserData_${number.replace(/[@.]/g, "_")}.json`;

      fs.writeFileSync(backupFileName, userData);

      // Kirim file backup ke pengguna
      const file = fs.readFileSync(`./${backupFileName}`);
      await conn.sendMessage(
         m.chat,
         {
            document: file,
            mimetype: "application/json",
            fileName: backupFileName,
            caption: `✅ Backup data untuk nomor ${args[0]} selesai. Silakan unduh file backup.`,
         },
         { quoted: m }
      );

      // Hapus file setelah dikirim
      setTimeout(() => {
         if (fs.existsSync(`./${backupFileName}`)) {
            fs.unlinkSync(`./${backupFileName}`);
         }
      }, 5000);
   } catch (error) {
      m.reply("❌ Terjadi kesalahan saat melakukan backup.");
      console.error(error);
   }
};

handler.help = ["bdm <nomor>"];
handler.tags = ["tools"];
handler.command = ["bdm"];
handler.private = false; // Bisa digunakan di mana saja
handler.rowner = true; // Hanya untuk owner bot

module.exports = handler;