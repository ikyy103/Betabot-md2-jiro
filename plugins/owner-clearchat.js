let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Masukkan nomor atau JID! Contoh: .clearchat 6281234567890';
  
  let jid = args[0].includes('@s.whatsapp.net') ? args[0] : `${args[0]}@s.whatsapp.net`;
  
  try {
    await conn.chatModify({ clear: { messages: [{ id: m.key.id, fromMe: false, timestamp: m.messageTimestamp }] } }, jid, [])
    await conn.sendMessage(m.chat, { text: `Berhasil menghapus chat dengan ${jid}` }, { quoted: m })
  } catch (e) {
    m.reply('Gagal menghapus chat. Pastikan nomor tersebut valid atau ada dalam daftar chat.');
  }
};

handler.help = ['clearchat <nomor>'];
handler.tags = ['owner'];
handler.command = /^clearchat$/i;
handler.owner = true;

module.exports = handler;