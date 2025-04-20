let handler = async (m, { conn, args, text, command, usedPrefix }) => {
    let user;

    // Jika ada yang ditag
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    }

    // Jika reply pesan
    else if (m.quoted) {
        user = m.quoted.sender;
    }

    // Jika input nomor
    else if (args[0]) {
        let input = args[0].replace(/[^0-9]/g, '');
        if (!input) throw `Nomor tidak valid!`;
        user = input + '@s.whatsapp.net';
    } else {
        throw `Contoh penggunaan:\n${usedPrefix + command} @user / balas pesan / 628xxx`;
    }

    // Cari index di list owner
    let index = global.owner.findIndex(([jid]) => jid === user);

    if (index < 0) throw 'User tersebut bukan owner.';
    if (index === 0) throw 'Tidak bisa menghapus owner utama.';

    // Hapus dari list owner
    global.owner.splice(index, 1);
    m.reply(`Sukses menghapus ${user} dari daftar owner.`);
};

handler.help = ['unowner @user / reply / nomor'];
handler.tags = ['owner'];
handler.command = /^unowner$/i;
handler.owner = true;

module.exports = handler;