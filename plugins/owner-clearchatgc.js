let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Masukkan ID grup! Contoh: .clearchatgc 1203630xxxxx@g.us';
  let jid = args[0];

  try {
    await conn.chatModify({ clear: { messages: [{ id: m.key.id }] } }, jid, []);
    m.reply(`Berhasil menghapus chat di grup: ${jid}`);
  } catch (e) {
    console.error(e);
    m.reply('Gagal menghapus chat. Pastikan ID grup benar dan terdaftar di chat.');
  }
};

handler.help = ['clearchatgc <idgrup>'];
handler.tags = ['owner'];
handler.command = /^clearchatgc$/i;
handler.owner = true;

module.exports = handler;