let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw(`Mohon masukan id yang akan di tuju\n\nContoh:\n${usedPrefix}${command} 628xxxxx@s.whatsapp.net`);
    let q = m.quoted;
    if (!q) throw 'Mohon reply pesannya';
    await q.copyNForward(text, true);
    m.reply("sukses");
};

handler.help = ['fordward'];
handler.tags = ['tools', 'premium', 'group'];
handler.command = /^(fordward|fw)$/i;
handler.premium = false;

module.exports = handler;