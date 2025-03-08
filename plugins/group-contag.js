let handler = async (m, { conn, args, text, usedPrefix, command, participants }) => {
    if (!text) throw `× Gunakan format yang benar:\nContoh:\n${usedPrefix}contag @tag|Nama\n${usedPrefix}contag 6281234567890|Nama`;

    let [input, name] = text.split('|').map(v => v.trim());

    if (!name) throw `× Pastikan format benar! Gunakan:\n${usedPrefix}contag @tag|Nama\n${usedPrefix}contag 6281234567890|Nama`;

    let target;
    if (input.startsWith('@')) {
        target = input.replace('@', '') + '@s.whatsapp.net';
    } else if (/^\d+$/.test(input)) {
        target = input + '@s.whatsapp.net';
    } else {
        throw `× Format tidak valid! Gunakan tag atau nomor tanpa spasi.\nContoh: ${usedPrefix}contag @user|Nama`;
    }

    let contact = {
        displayName: "Contact",
        contacts: [{
            displayName: name,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${name}\nitem1.TEL;waid=${target.split('@')[0]}:${target.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
        }]
    };

    await conn.sendMessage(m.chat, { contacts: contact, mentions: [target] }, { ephemeralExpiration: 86400 });
};

handler.help = ['contag @tag|Nama', 'contag nomor|Nama'];
handler.tags = ['tools'];
handler.command = /^contag$/i;
handler.group = true;

module.exports = handler;