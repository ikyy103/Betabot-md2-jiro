let handler = async (m, { conn, text, isROwner }) => {
   try {
      if (!isROwner) throw "❌ Perintah ini hanya dapat digunakan oleh *Owner Bot*!";

      // Validasi input
      if (!text) throw "❌ Harap masukkan data yang ingin diperbarui. Contoh format:\n\n<number> {\"key\":\"value\"}";

      // Pisahkan nomor dan JSON
      let [number, ...jsonParts] = text.split("\n");
      let jsonData = jsonParts.join("\n").trim(); // Gabungkan data JSON yang terpisah oleh newline
      if (!number || !jsonData) throw "❌ Format salah. Pastikan menggunakan format:\n\n<number>\n{\"key\":\"value\"}";

      // Validasi nomor
      let userId = `${number.replace(/[^0-9]/g, '')}@s.whatsapp.net`;

      // Parse JSON data
      let data;
      try {
         data = JSON.parse(jsonData);
      } catch (e) {
         throw "❌ Format data tidak valid. Pastikan menggunakan format JSON yang benar.";
      }

      // Pastikan data adalah object
      if (typeof data !== "object" || Array.isArray(data)) {
         throw "❌ Format data salah. Data harus berupa objek JSON.";
      }

      // Periksa apakah pengguna sudah ada di database
      if (!global.db.data.users[userId]) {
         global.db.data.users[userId] = {}; // Inisialisasi pengguna jika belum ada
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

      m.reply(`✅ Data pengguna berhasil diperbarui!\n\n*Nomor:* ${number}\n*Data:* ${JSON.stringify(data, null, 2)}`);
   } catch (error) {
      console.error(error);
      m.reply(error || "❌ Terjadi kesalahan saat memperbarui data.");
   }
};

handler.help = ["updatedata <number> <json>"];
handler.tags = ["owner"];
handler.command = ["updatedata"];
handler.owner = true;

module.exports = handler;