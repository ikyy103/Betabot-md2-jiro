// Fitur: ClearChat Multifungsi const { WAMessageStubType } = require('@adiwajshing/baileys');

let handler = async (m, { conn, args, command }) => { switch (command) { case 'clearchat': { let jid = args[0] && args[0].includes('@s.whatsapp.net') ? args[0] : m.chat; await conn.chatModify({ clear: { messages: [{ id: m.key.id, fromMe: true }] } }, jid); m.reply(✅ Obrolan dihapus untuk ${jid === m.chat ? 'chat ini' : jid}); break; }

case 'clearchatall': {
  let chats = Object.keys(conn.chats);
  for (let id of chats) {
    try {
      await conn.chatModify({ clear: {} }, id);
    } catch (e) {
      console.error(`Gagal hapus chat: ${id}`);
    }
  }
  m.reply('✅ Semua chat berhasil dihapus.');
  break;
}

case 'clearchatgc': {
  let jid = args[0];
  if (!jid || !jid.endsWith('@g.us')) throw 'Masukkan ID grup yang valid!';
  await conn.chatModify({ clear: {} }, jid);
  m.reply(`✅ Chat grup ${jid} telah dibersihkan.`);
  break;
}

case 'clearchatgcall': {
  let groupChats = Object.keys(conn.chats).filter(id => id.endsWith('@g.us'));
  for (let id of groupChats) {
    try {
      await conn.chatModify({ clear: {} }, id);
    } catch (e) {
      console.error(`Gagal hapus grup: ${id}`);
    }
  }
  m.reply('✅ Semua chat grup berhasil dihapus.');
  break;
}

case 'autoclearchat': {
  let threshold = 1000 * 60 * 60 * 24 * 7; // 7 hari
  let now = Date.now();
  let chats = Object.entries(conn.chats);
  for (let [id, data] of chats) {
    if (data.messages && data.messages.length > 0) {
      let lastMsg = data.messages[data.messages.length - 1];
      let msgTime = lastMsg.messageTimestamp * 1000;
      if (now - msgTime > threshold) {
        try {
          await conn.chatModify({ clear: {} }, id);
        } catch (e) {
          console.error(`Gagal hapus otomatis: ${id}`);
        }
      }
    }
  }
  m.reply('✅ Autoclear selesai. Chat lama telah dibersihkan.');
  break;
}

} };

handler.help = [ 'clearchat [jid opsional]', 'clearchatall', 'clearchatgc <id grup>', 'clearchatgcall', 'autoclearchat' ];

handler.tags = ['tools', 'owner']; handler.command = /^(clearchat|clearchatall|clearchatgc|clearchatgcall|autoclearchat)$/i; handler.owner = true;

module.exports = handler;