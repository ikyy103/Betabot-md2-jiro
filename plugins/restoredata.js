let handler = async (m, { conn, text, isROwner }) => {
   try {
      if (!isROwner) throw "❌ Perintah ini hanya dapat digunakan oleh *Owner Bot*!";

      // Validasi input
      if (!text) throw "❌ Harap masukkan data yang ingin di-restore. Contoh format:\n\n627192772918 {\"key\":\"value\"}";

      // Ekstraksi nomor dan JSON
      let firstSpaceIndex = text.indexOf(" ");
      if (firstSpaceIndex === -1) throw "❌ Format salah. Pastikan menggunakan format:\n\n<number> {\"key\":\"value\"}";

      let number = text.substring(0, firstSpaceIndex).trim();
      let jsonData = text.substring(firstSpaceIndex).trim();

      // Pastikan nomor valid
      let userId = `${number}@s.whatsapp.net`;
      if (!/^\d+$/.test(number)) throw "❌ Nomor tidak valid. Pastikan hanya berisi angka.";

      // Parse JSON data
      let data;
      try {
         data = JSON.parse(jsonData);
      } catch (e) {
         throw "❌ Format data tidak valid. Pastikan menggunakan format JSON yang benar.";
      }

      // Validasi format data sebagai objek
      if (typeof data !== "object" || Array.isArray(data)) {
         throw "❌ Format data salah. Data harus berupa objek JSON.";
      }

      // Inisialisasi pengguna jika belum ada
      if (!global.db.data.users[userId]) {
         global.db.data.users[userId] = {};
      }

      // Fungsi untuk menggabungkan data secara rekursif
      const mergeDeep = (target, source) => {
         for (const key of Object.keys(source)) {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
               if (!target[key]) target[key] = {};
               mergeDeep(target[key], source[key]);
            } else {
               target[key] = source[key];
            }
         }
      };

      // Gabungkan data baru dengan data yang sudah ada
      mergeDeep(global.db.data.users[userId], data);

      m.reply(`✅ Data pengguna berhasil dipulihkan!\n\n*Nomor:* ${number}\n*Data:* ${JSON.stringify(data, null, 2)}`);
   } catch (error) {
      console.error(error);
      m.reply(error || "❌ Terjadi kesalahan saat memulihkan data.");
   }
};

handler.help = ["restoredata <number> <json>"];
handler.tags = ["owner"];
handler.command = ["restoredata"];
handler.owner = true;

module.exports = handler;