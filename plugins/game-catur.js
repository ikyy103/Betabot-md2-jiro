const { Chess } = require("chess.js");

let handler = async (m, { conn, args }) => {
  conn.chess = conn.chess || {};
  const from = m.chat;
  const sender = m.sender;

  if (!conn.chess[from])
    conn.chess[from] = { players: [], status: "waiting", game: null };

  const chessData = conn.chess[from];
  const subCmd = (args[0] || "").toLowerCase();

  if (subCmd === "start") {
    if (chessData.status === "playing")
      return m.reply("Sudah ada game yang berjalan di grup ini.");

    chessData.players = [sender];
    chessData.status = "waiting";
    chessData.game = new Chess();

    m.reply(
      `Game catur dimulai!\n\n@${sender.split("@")[0]} membuat room.\n\nKetik *#catur join* untuk ikut bermain.`,
      { mentions: [sender] }
    );

  } else if (subCmd === "join") {
    if (chessData.status === "playing")
      return m.reply("Game sudah dimulai.");

    if (chessData.players.includes(sender))
      return m.reply("Kamu sudah masuk room.");

    if (chessData.players.length >= 2)
      return m.reply("Room sudah penuh.");

    chessData.players.push(sender);

    if (chessData.players.length === 2) {
      chessData.status = "playing";
      m.reply(
        `Permainan dimulai!\n\nPutih: @${chessData.players[0].split("@")[0]}\nHitam: @${chessData.players[1].split("@")[0]}\n\nGiliran @${chessData.players[0].split("@")[0]} (putih) jalan dulu.\n\nKetik *#catur move e2 e4*`,
        { mentions: chessData.players }
      );
    } else {
      m.reply(`@${sender.split("@")[0]} bergabung!`, { mentions: [sender] });
    }

  } else if (subCmd === "move") {
    if (chessData.status !== "playing")
      return m.reply("Belum ada game yang berjalan di grup ini.");

    if (!chessData.players.includes(sender))
      return m.reply("Kamu bukan peserta game ini.");

    const moveFrom = args[1];
    const moveTo = args[2];
    if (!moveFrom || !moveTo)
      return m.reply("Format: *#catur move e2 e4*");

    const turn = chessData.game.turn();
    const playerIndex = chessData.players.indexOf(sender);
    const expectedTurn = playerIndex === 0 ? "w" : "b";

    if (turn !== expectedTurn)
      return m.reply("Sekarang bukan giliran kamu.");

    const move = chessData.game.move({ from: moveFrom, to: moveTo });

    if (move === null)
      return m.reply("Langkah tidak valid.");

    // Tampilkan papan
    m.reply("Langkah berhasil!\n\n" + chessData.game.ascii());

    if (chessData.game.game_over()) {
      let hasil = "Permainan berakhir.\n";
      if (chessData.game.in_checkmate()) {
        hasil += `Checkmate!\nMenang: @${
          chessData.players[playerIndex].split("@")[0]
        }`;
      } else {
        hasil += "Hasil seri.";
      }
      m.reply(hasil, { mentions: chessData.players });
      delete conn.chess[from];
    }

  } else if (subCmd === "papan") {
    if (!chessData.game)
      return m.reply("Belum ada game catur yang aktif di grup ini.");

    m.reply(chessData.game.ascii());

  } else if (subCmd === "hapus") {
    delete conn.chess[from];
    m.reply("Game catur di grup ini telah dihapus.");
  } else {
    m.reply(`*Format perintah:*\n
#catur start → buat room
#catur join → masuk room
#catur move e2 e4 → jalanin bidak
#catur papan → lihat papan
#catur hapus → hapus game`);
  }
};

handler.help = ['catur <start|join|move|papan|hapus>'];
handler.tags = ['game'];
handler.command = /^catur$/i;
handler.limit = true;
handler.group = true;

module.exports = handler;