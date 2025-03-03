/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
const handler = async (m, { conn, usedPrefix, args, command }) => {
  // Inisialisasi objek jbRooms dan jbVotes jika belum ada
  conn.jbRooms = conn.jbRooms || {};
  conn.jbVotes = conn.jbVotes || {};

  // Daftar klub yang tersedia
  const clubs = [
    "Real Madrid", "Manchester United", "Inter Milan", "Barcelona",
    "Liverpool", "Paris Saint-Germain", "Chelsea", "Juventus",
    "Borussia Dortmund", "Atletico Madrid", "RB Leipzig", "Porto",
    "Arsenal", "Shakhtar Donetsk", "Red Bull Salzburg", "AC Milan",
    "Braga", "PSV Eindhoven", "Lazio", "Red Star Belgrade", "FC Copenhagen"
  ];

  // Fungsi untuk mengacak array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Fungsi untuk menghitung vote
  const countVotes = (votes) => {
    const voteCount = { "1": 0, "2": 0 };
    Object.values(votes).forEach(vote => {
      if (voteCount[vote] !== undefined) {
        voteCount[vote]++;
      }
    });
    return voteCount;
  };

  // Handle perintah tanpa argumen atau dengan argumen 'help'
  if (!args[0] || args[0] === "help") {
    const message = `*❏ JUDI BOLA⚽*

• ${usedPrefix}jb create (buat room) 
• ${usedPrefix}jb join (player join, taruhan 1000000)
• ${usedPrefix}jb player (daftar pemain yang bergabung)
• ${usedPrefix}jb mulai (mulai game)
• ${usedPrefix}jb vote 1/2 (vote klub pilihan)
• ${usedPrefix}jb delete (hapus sesi room game)

Buatkan sebuah permainan tebak pertandingan bola, contoh: 1 Braga vs 2 Lazio

Untuk pilihan, gunakan ${usedPrefix}jb vote 1 atau 2

Minimal player yang bergabung untuk memulai game adalah 2 pemain.

Taruhan: 1000000
Hadiah: 900000000000`;
    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: "Judi Bola ⚽",
          body: "Ayo ikut dan menangkan hadiahnya!",
          thumbnailUrl: 'https://telegra.ph/file/3463760976052aeac5f21.jpg',
          sourceUrl: "https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
    return;
  }

  // Logika berdasarkan argumen pertama
  switch (args[0].toLowerCase()) {
    case 'create': {
      if (conn.jbRooms[m.chat]) return m.reply('Room sudah ada.');
      conn.jbRooms[m.chat] = { players: [], gameStarted: false, clubs: [], bank: 0 };
      m.reply('Room berhasil dibuat. Pemain sekarang bisa bergabung.');
      break;
    }
    case 'join': {
      if (!conn.jbRooms[m.chat]) return m.reply('Belum ada room yang dibuat. Gunakan .jb create untuk membuat room.');
      if (conn.jbRooms[m.chat].gameStarted) return m.reply('Game sudah dimulai. Tidak bisa bergabung sekarang.');
      if (conn.jbRooms[m.chat].players.find(p => p.id === m.sender)) return m.reply('Anda sudah bergabung di room.');
      const playerName = m.pushName || conn.getName(m.sender);
      conn.jbRooms[m.chat].players.push({ id: m.sender, name: playerName });
      conn.jbRooms[m.chat].bank += 1000000;
      m.reply(`Anda berhasil bergabung di room. Total taruhan: ${conn.jbRooms[m.chat].bank}`);
      break;
    }
    case 'player': {
      if (!conn.jbRooms[m.chat]) return m.reply('Belum ada room yang dibuat.');
      const players = conn.jbRooms[m.chat].players;
      m.reply(`Pemain yang bergabung:\n${players.map(p => `${p.name} (${p.id})`).join('\n')}`);
      break;
    }
    case 'mulai': {
      if (!conn.jbRooms[m.chat]) return m.reply('Belum ada room yang dibuat.');
      if (conn.jbRooms[m.chat].players.length < 2) return m.reply('Minimal 2 pemain untuk memulai game.');
      shuffleArray(clubs);
      conn.jbRooms[m.chat].clubs = [clubs[0], clubs[1]];
      conn.jbRooms[m.chat].gameStarted = true;
      m.reply(`Game dimulai! Pertandingan: 1 ${clubs[0]} vs 2 ${clubs[1]}. Silakan vote klub pilihan Anda.`);
      break;
    }
    case 'vote': {
      if (!conn.jbRooms[m.chat]) return m.reply('Belum ada room yang dibuat.');
      if (!conn.jbRooms[m.chat].gameStarted) return m.reply('Game belum dimulai.');
      if (!args[1] || !['1', '2'].includes(args[1])) return m.reply('Gunakan .jb vote 1 atau 2.');
      const vote = args[1];
      const currentRoom = conn.jbRooms[m.chat];
      const player = currentRoom.players.find(p => p.id === m.sender);
      if (!player) return m.reply('Anda belum bergabung dalam room.');
      conn.jbVotes[m.sender] = vote;
      m.reply(`Anda memilih klub nomor ${vote}.`);
      const voteCount = countVotes(conn.jbVotes);
      if (Object.keys(conn.jbVotes).length === currentRoom.players.length) {
        m.reply('Semua pemain telah vote. Pertandingan akan segera dimulai...');
        setTimeout(() => {
          m.reply('Pertandingan telah selesai.');
          const winnerVote = voteCount["1"] > voteCount["2"] ? "1" : "2";
          const winningClub = currentRoom.clubs[winnerVote - 1];
          const winners = currentRoom.players.filter(player => conn.jbVotes[player.id] === winnerVote);
          m.reply(`Pemenang adalah ${winningClub}.\nPemenang:\n${winners.map(w => w.name).join('\n')}`);
          delete conn.jbRooms[m.chat];
          delete conn.jbVotes[m.chat];
        }, 25000);
      }
      break;
    }
    case 'delete': {
      if (!conn.jbRooms[m.chat]) return m.reply('Belum ada room yang dibuat.');
      delete conn.jbRooms[m.chat];
      delete conn.jbVotes[m.chat];
      m.reply('Room telah dihapus.');
      break;
    }
    default:
      m.reply('Perintah tidak dikenal. Gunakan .jb help untuk melihat daftar perintah.');
  }
};

handler.help = ['judibola'];
handler.tags = ['game'];
handler.command = /^(judibola|jb)$/i;
handler.group = true;

module.exports = handler;