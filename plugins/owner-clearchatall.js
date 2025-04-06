let handler = async (m, { conn }) => {
  const keepJid = [
    '6281547205987@s.whatsapp.net', // nomor owner
    '120363347063028657@g.us' // grup penting
  ];

  let allChats = await conn.chats.all();
  let deleted = 0;

  for (let chat of allChats) {
    if (!keepJid.includes(chat.id)) {
      await conn.chatModify({ clear: { messages: [{ id: chat.messages?.[0]?.key?.id }] } }, chat.id, []);
      deleted++;
      await delay(1500); // beri jeda agar tidak terkena limit
    }
  }

  m.reply(`Berhasil membersihkan ${deleted} chat yang tidak penting.`)
};

handler.help = ['clearchatall'];
handler.tags = ['owner'];
handler.command = /^clearchatall$/i;
handler.owner = true;

module.exports = handler;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}