let handler = async (m, { text }) => {
   try {
      // Periksa apakah teks disediakan
      if (!text) throw "❌ Masukkan teks yang ingin diubah ke Aesthetic Font. Contoh: *.aesthetic Halo Dunia*";

      // Peta huruf ke aesthetic font
      const aestheticMap = {
         a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "𝑒", f: "𝒻", g: "𝑔",
         h: "𝒽", i: "𝒾", j: "𝒿", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃",
         o: "𝑜", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉", u: "𝓊",
         v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
         A: "𝒜", B: "𝐵", C: "𝒞", D: "𝒟", E: "𝐸", F: "𝐹", G: "𝒢",
         H: "𝐻", I: "𝐼", J: "𝒥", K: "𝒦", L: "𝐿", M: "𝑀", N: "𝒩",
         O: "𝒪", P: "𝒫", Q: "𝒬", R: "𝑅", S: "𝒮", T: "𝒯", U: "𝒰",
         V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵",
         0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫",
         " ": " ", ".": ".", ",": ",", "!": "!", "?": "?", "'": "'", "\"": "\""
      };

      // Ubah teks ke aesthetic font
      const toAesthetic = (str) => str.split("").map(char => aestheticMap[char] || char).join("");

      // Hasil konversi
      let aestheticText = toAesthetic(text);

      // Kirim teks yang sudah diubah
      m.reply(`${aestheticText}`);
   } catch (error) {
      m.reply("❌ Terjadi kesalahan: " + error);
      console.error(error);
   }
};

handler.help = ["aesthetic <teks>"];
handler.tags = ["tools"];
handler.command = ["aesthetic", "fontaesthetic", "aestheticfont"];

module.exports = handler;