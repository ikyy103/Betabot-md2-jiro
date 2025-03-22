const axios = require("axios");

const url = "https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv";
let dataWilayah = null;

// Parsing CSV menjadi array objek { kode, nama }
const parseCSV = (csv) => {
  return csv.split("\n").map((line) => {
    const [kode, nama] = line.split(",");
    return { kode: kode.trim(), nama: nama?.trim() };
  });
};

// Mengambil data wilayah dari sumber eksternal
const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    dataWilayah = parseCSV(data);
  } catch (error) {
    console.error("Error fetching CSV:", error);
  }
};

// Mencari wilayah berdasarkan query pengguna
const search = async (query) => {
  if (!dataWilayah) await fetchData();

  const queryWords = query.toLowerCase().split(" ");
  return dataWilayah.filter((item) => {
    const searchString = `${item.kode} ${item.nama}`.toLowerCase();
    return queryWords.every((word) => searchString.includes(word));
  });
};

// Handler untuk fitur di bot
let handler = async (m, { args, usedPrefix, command }) => {
  if (args.length < 1) {
    return m.reply(`📌 *Gunakan format:*\n${usedPrefix + command} <nama_daerah>\n\nContoh:\n${usedPrefix + command} jawa barat`);
  }

  let query = args.join(" ");
  let results = await search(query);

  if (results.length === 0) {
    return m.reply(`⚠️ Tidak ditemukan wilayah dengan kata kunci *${query}*. Coba gunakan kata kunci yang lebih spesifik.`);
  }

  let responseText = `📍 *Hasil Pencarian untuk:* _"${query}"_\n\n`;
  results.slice(0, 10).forEach((result, index) => {
    responseText += `${index + 1}. 🏙️ *${result.nama}*\n   🆔 Kode: ${result.kode}\n\n`;
  });

  m.reply(responseText);
};

handler.help = ["cariwilayah"];
handler.tags = ["info"];
handler.command = /^(cariwilayah)$/i;
handler.register = true;

module.exports = handler;