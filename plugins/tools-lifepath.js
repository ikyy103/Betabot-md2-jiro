let handler = async (m, { conn, text }) => {
   try {
      // Validasi input
      if (!text) throw "❌ Harap masukkan tanggal lahir dalam format DD/MM/YYYY!";

      // Pisahkan input menjadi hari, bulan, dan tahun
      let [day, month, year] = text.split('/').map(Number);
      if (!day || !month || !year) throw "❌ Format salah. Pastikan menggunakan format DD/MM/YYYY!";

      // Hitung Life Path Number
      const calculateLifePathNumber = (day, month, year) => {
         const sumDigits = (num) => num.toString().split('').map(Number).reduce((a, b) => a + b, 0);
         let total = sumDigits(day) + sumDigits(month) + sumDigits(year);
         
         // Reduksi hingga satu digit
         while (total > 9) {
            total = sumDigits(total);
         }
         return total;
      };

      const lifePathNumber = calculateLifePathNumber(day, month, year);

      m.reply(`✅ Life Path Number Anda adalah: *${lifePathNumber}* 🎉`);
   } catch (error) {
      console.error(error);
      m.reply(error || "❌ Terjadi kesalahan saat menghitung Life Path Number.");
   }
};

handler.help = ['lifepath <DD/MM/YYYY>'];
handler.tags = ['numerology','tools'];
handler.command = ['lifepath'];

module.exports = handler;