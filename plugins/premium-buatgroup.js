// const { bold } = require("chalk");
let handler = async (m, { conn, text }) => {
   
   if (!text) return m.reply('_Masukkan Nama Grup!_');
   try {
       m.reply(wait);
       let group = await conn.groupCreate(text, [m.sender]);
       let link = await conn.groupInviteCode(group.gid);
       let url = 'https://chat.whatsapp.com/' + link;
       // console.log(bold.red('Membuat Grup: ' + group.gid + '\nNama Grup: ' + text + '\n\nViolet'));
       m.reply('_Berhasil Membuat Grup *' + text + '*_\n\n*Nama:* ' + text + '\n*ID:* ' + group.gid + '\n*Link:* ' + url);
   } catch (e) {
       m.reply(`Error`);
   }
}

handler.help = ['creategroup'];
handler.tags = ['owner', 'premium'];
handler.command = /^((create|buat)(gc|grup|group))$/;
handler.owner = false;
handler.premium = true;

module.exports = handler;