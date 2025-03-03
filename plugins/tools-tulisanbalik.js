let handler = async (m, { text }) => {
   try {
      // Periksa apakah teks disediakan
      if (!text) throw "❌ Masukkan teks yang ingin dibalik. Contoh: *.reverse Halo Dunia*";

      // Fungsi untuk membalikkan teks
      const reverseText = (str) => str.split("").reverse().join("");

      // Membalikkan teks yang diberikan
      let reversedText = reverseText(text);

      // Kirim teks yang sudah dibalik
      m.reply(`${reversedText}`);
   } catch (error) {
      m.reply("❌ Terjadi kesalahan: " + error);
      console.error(error);
   }
};

handler.help = ["reverse <teks>"];
handler.tags = ["tools"];
handler.command = ["reverse", "balik", "tulisanbalik"];

module.exports = handler;