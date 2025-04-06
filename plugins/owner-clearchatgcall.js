let handler = async (m, { conn }) => {
  let allChats = await conn.chats.all();
  let deleted = 0;

  for (let chat of allChats) {
    if (chat.id.endsWith('@g.us')) {
      try {
        await conn.chatModify({ clear: { messages: [{ id: chat.messages?.[0]?.key?.id }] } }, chat.id, []);
        deleted++;
        await delay(1000); // beri delay agar tidak overload
      } catch (e) {
        console.log(`Gagal hapus chat grup: ${chat.id}`);
      }
    }
  }

  m.reply(`Berhasil menghapus chat dari ${deleted} grup.`);
};

handler.help = ['clearchatgcall'];
handler.tags = ['owner'];
handler.command = /^clearchatgcall$/i;
handler.owner = true;

module.exports = handler;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}