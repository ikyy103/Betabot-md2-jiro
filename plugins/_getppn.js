let fetch = require("node-fetch");
let handler = async(m, { conn, command }) => {
  try {
    // Ambil nomor telepon dari input
    let phoneNumber = m.text.split(" ")[1];
    if (!phoneNumber) throw "Nomor WA tidak ditemukan! 📞";

    // Format nomor telepon menjadi jid
    let jid = `${phoneNumber}@s.whatsapp.net`;

    // Ambil foto profil
    let pp = await conn.profilePictureUrl(jid, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    conn.sendFile(m.chat, pp, "nih bang.png", 'Selesai....', m, { jpegThumbnail: await (await fetch(pp)).buffer() });
  } catch (error) {
    console.error(error);
    let sender = m.sender;
    let pp = await conn.profilePictureUrl(sender, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    conn.sendFile(m.chat, pp, 'ppsad.png', "Selesai....", m, { jpegThumbnail: await (await fetch(pp)).buffer() });
  }
}

handler.help = ['getppn <nomor wa>'];
handler.tags = ['group'];
handler.command = /^(getppn|getpic?t?n|ppnum)$/i;

module.exports = handler;