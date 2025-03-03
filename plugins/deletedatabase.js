const fs = require("fs");
const path = "./database.json"; // Ganti sesuai dengan lokasi file database Anda

let handler = async (m, { conn, isROwner }) => {
   try {
      if (!isROwner) throw "❌ Perintah ini hanya dapat digunakan oleh *Owner Bot*!";

      // Cek apakah file database ada
      if (fs.existsSync(path)) {
         // Hapus file database lama
         fs.unlinkSync(path);
         m.reply("✅ Database lama berhasil dihapus!");

         // Buat file database baru yang kosong
         fs.writeFileSync(path, JSON.stringify({ users: {}, groups: {}, chats: {} }, null, 2));
         m.reply("✅ Database baru telah dibuat!");
      } else {
         m.reply("⚠️ File database tidak ditemukan. Membuat database baru...");
         // Buat file database baru jika belum ada
         fs.writeFileSync(path, JSON.stringify({ users: {}, groups: {}, chats: {} }, null, 2));
         m.reply("✅ Database baru telah dibuat!");
      }
   } catch (error) {
      console.error(error);
      m.reply("❌ Terjadi kesalahan saat menghapus atau membuat database baru.");
   }
};

handler.help = ["deletedatabase"];
handler.tags = ["owner"];
handler.command = ["deletedatabase"];
handler.owner = true;

module.exports = handler;