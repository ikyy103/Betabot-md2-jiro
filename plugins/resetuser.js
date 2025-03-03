let handler = async (m, { conn, isROwner }) => {
   try {
      if (!isROwner) throw "❌ Perintah ini hanya dapat digunakan oleh *Owner Bot*!";

      // Hapus semua data user
      global.db.data.users = {};

      // Kirim pesan konfirmasi
      m.reply("✅ Semua data pengguna berhasil dihapus dari database!");
   } catch (error) {
      console.error(error);
      m.reply("❌ Terjadi kesalahan saat mereset data pengguna.");
   }
};

handler.help = ["resetuser"];
handler.tags = ["owner"];
handler.command = ["resetuser"];
handler.owner = true;

module.exports = handler;