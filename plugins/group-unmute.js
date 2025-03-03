let handler = async (m, { conn, args, command, text }) => {
   if (!text) throw 'Mana idnya?'
  try { 
	let group = text
        await conn.reply(text, 'Group Berhasil di *UNMUTE*', null)
        global.db.data.chats[text].isBanned = false

        await conn.reply(m.sender, 'Succes!', m)
        } catch (error) {
    console.log(error);
    throw 'Error ' + error;
  }
        }
handler.help = ['unmutebyid', 'unmutegroupbyid', 'unmute < Id group>']
handler.tags = ['group']
handler.command = /^unmutegroupbyid|unmutebyid|unmutegcbyid|unmute$/i

handler.admin = false
handler.botAdmin = false
handler.group = false
handler.limit = true
handler.owner = false

module.exports = handler