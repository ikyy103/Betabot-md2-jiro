const axios = require('axios');

const deviceIDs = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

const typeMsg = {
  'anonymous': '',
  'confessions': 'confess',
  '3words': '3words',
  'neverhave': 'neverhave',
  'tbh': 'tbh',
  'shipme': 'shipme',
  'yourcrush': 'yourcrush',
  'cancelled': 'cancelled',
  'dealbreaker': 'dealbreaker',
  'random': 'random' // Tipe baru untuk pesan acak
};

// Daftar pesan random diperluas menjadi 50
const randomMessages = [
  "Apakah kamu percaya alien itu nyata?",
  "Apa kenangan masa kecilmu yang paling lucu?",
  "Kalau kamu bisa jadi karakter di film, siapa yang kamu pilih?",
  "Kamu lebih suka hujan atau cerah?",
  "Kalau kamu bisa makan satu makanan seumur hidup, apa itu?",
  "Apa kebiasaan teraneh yang kamu punya?",
  "Siapa superhero favoritmu, dan kenapa?",
  "Apa hal teraneh yang pernah kamu lihat di jalan?",
  "Kamu pernah ketiduran di tempat umum?",
  "Kalau kamu bisa bicara dengan satu binatang, binatang apa itu?",
  "Apa film terakhir yang membuatmu menangis?",
  "Kalau kamu bisa ulang satu momen hidupmu, apa itu?",
  "Apa warna yang paling menggambarkan kepribadianmu?",
  "Apa hal tergila yang pernah kamu lakukan demi cinta?",
  "Kalau bisa jadi milyarder, apa yang akan kamu lakukan pertama kali?",
  "Apa pelajaran hidup terbesar yang pernah kamu dapat?",
  "Siapa yang paling berpengaruh dalam hidupmu?",
  "Kalau kamu bisa pergi ke mana saja sekarang, ke mana itu?",
  "Apa tujuan terbesarmu dalam hidup?",
  "Apa kebohongan terbesar yang pernah kamu katakan?",
  "Apa hal paling memalukan yang terjadi di sekolah?",
  "Kalau kamu punya mesin waktu, kamu mau ke masa lalu atau masa depan?",
  "Apa hal favoritmu tentang dirimu sendiri?",
  "Apa yang bikin kamu semangat setiap pagi?",
  "Kalau kamu jadi hewan, hewan apa yang cocok buatmu?",
  "Siapa teman terdekatmu, dan kenapa kalian begitu dekat?",
  "Apa rahasia kecilmu yang belum pernah kamu ceritakan ke siapa pun?",
  "Kamu lebih suka kucing atau anjing? Kenapa?",
  "Apa hal kecil yang bikin kamu bahagia?",
  "Apa mimpi teraneh yang pernah kamu alami?",
  "Siapa yang paling kamu rindukan saat ini?",
  "Apa lagu yang paling sering kamu dengarkan akhir-akhir ini?",
  "Kalau kamu bisa mengganti namamu, apa nama barumu?",
  "Apa hal terakhir yang membuatmu tertawa keras?",
  "Kalau bisa punya kekuatan super, kekuatan apa yang kamu pilih?",
  "Apa nasihat terbaik yang pernah kamu dapatkan?",
  "Apa hal paling spontan yang pernah kamu lakukan?",
  "Kamu pernah jatuh cinta pada pandangan pertama?",
  "Kalau hidupmu dijadikan buku, judul apa yang cocok?",
  "Apa yang kamu lakukan saat bosan?",
  "Kamu lebih suka hari Senin atau Jumat?",
  "Apa cemilan favoritmu waktu kecil?",
  "Kalau kamu jadi kaya mendadak, siapa orang pertama yang kamu kasih uang?",
  "Apa hal yang kamu takuti tapi juga penasaran?",
  "Apa hal yang selalu kamu bawa ke mana-mana?",
  "Siapa yang paling sering bikin kamu marah?",
  "Apa hal yang bikin kamu merasa paling bersyukur hari ini?",
  "Kalau kamu bisa ubah satu hal di dunia ini, apa itu?",
  "Kamu lebih pilih hidup di kota besar atau desa kecil?",
  "Apa hal pertama yang kamu lakukan setiap pagi?"
];

const ngl = {
  send: async (link, message, type = "anonymous") => {
    const username = link.split('/').pop();
    let referrer, gameSlug;
    if (type === 'anonymous') {
      referrer = `https://ngl.link/${username}`;
      gameSlug = '';
    } else if (type === 'random') {
      referrer = `https://random.ngl.link/${username}`;
      gameSlug = 'random';
    } else if (typeMsg[type]) {
      referrer = `https://${type}.ngl.link/${username}`;
      gameSlug = type;
    } else {
      gameSlug = typeMsg[type] || '';
      referrer = `https://ngl.link/${username}/${gameSlug}`;
    }
    const deviceId = deviceIDs();
    const data = {
      username: username,
      question: message,
      deviceId: deviceId,
      gameSlug: gameSlug,
      referrer: referrer
    };
    const url = "https://ngl.link/api/submit";
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Postify/1.0.0'
        }
      });
      if (response.status === 200) {
        console.log(`✅ Pesan (${type}) berhasil dikirim!`);
        return true;
      } else {
        console.error(`❌ Pesan (${type}) gagal dikirim: `, response.statusText);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error:`, error.message);
      return false;
    }
  }
};

const handler = async (m, { text, args, command, conn }) => {
  if (args.length < 2) {
    return m.reply(`Gunakan format yang benar:\n${command} <link> <jumlah_pesan> <tipe> <teks_pesan>\n\nTambahkan 'random' untuk pengiriman pesan acak.`);
  }
  
  const link = args[0];
  const count = parseInt(args[1]);
  const type = args[2]?.toLowerCase() || 'anonymous';
  const customMessage = args.slice(3).join(' ');
  const isRandom = customMessage.toLowerCase() === 'random';

  if (isNaN(count) || count <= 0) {
    return m.reply('Jumlah pesan harus berupa angka positif.');
  }

  if (!Object.keys(typeMsg).includes(type) && type !== 'anonymous') {
    return m.reply('Tipe pesan tidak valid. Pilih tipe yang tersedia:\nanonymous, confessions, 3words, neverhave, tbh, shipme, yourcrush, cancelled, dealbreaker, random.');
  }

  let successCount = 0;

  for (let i = 0; i < count; i++) {
    const message = type === 'random' 
      ? randomMessages[Math.floor(Math.random() * randomMessages.length)] 
      : isRandom 
        ? randomMessages[Math.floor(Math.random() * randomMessages.length)] 
        : customMessage;

    const success = await ngl.send(link, message, type);
    if (success) successCount++;
  }

  m.reply(`✅ Total pesan terkirim: ${successCount}/${count}\n\n📌 Mode: ${type === 'random' ? 'Pesan Random (tipe)' : isRandom ? 'Pesan Random (manual)' : 'Pesan Custom'}`);
};

handler.command = ['sendngl'];
handler.tags = ['internet'];
handler.help = ['sendngl <link> <jumlah_pesan> <tipe> <teks_pesan>'];

module.exports = handler;