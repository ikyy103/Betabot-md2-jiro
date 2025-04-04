let handler = async (m, { conn, text, args, command }) => {
    let input = text || (m.quoted && m.quoted.text);
    if (!input) throw `Masukkan format waktu seperti: .setclosegc 00:00 | 05:00`;

    let [tutup, buka] = input.split('|').map(x => x.trim());

    if (!/^\d{2}:\d{2}$/.test(tutup) || !/^\d{2}:\d{2}$/.test(buka)) {
        throw 'Format waktu salah. Gunakan format: HH:MM | HH:MM';
    }

    if (!db.data.autoclose) db.data.autoclose = {};
    db.data.autoclose[m.chat] = {
        tutup,
        buka,
        aktif: true
    };

    m.reply(`✅ AutoClose Grup diaktifkan!\nTutup: ${tutup}\nBuka: ${buka}`);
};

handler.help = ['setclosegc <tutup> | <buka>'];
handler.tags = ['group'];
handler.command = /^setclosegc$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

module.exports = handler;