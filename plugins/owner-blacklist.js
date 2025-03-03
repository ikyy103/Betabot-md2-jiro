// Data global untuk menyimpan grup yang diblacklist
global.blacklistedGroups = global.blacklistedGroups || [];

let handler = async (m, { conn, text, command, isOwner }) => {
    if (!isOwner) throw '❌ Perintah ini hanya dapat digunakan oleh Owner!';

    if (command === 'addblacklist') {
        if (!text) throw '❌ Masukkan ID grup yang ingin diblacklist!';
        if (global.blacklistedGroups.includes(text)) throw '❌ Grup sudah ada dalam blacklist!';

        global.blacklistedGroups.push(text);
        m.reply(`✅ Grup dengan ID ${text} berhasil ditambahkan ke daftar blacklist!`);
    }

    if (command === 'listblacklist') {
        if (global.blacklistedGroups.length === 0) return m.reply('📋 Tidak ada grup yang diblacklist.');
        let list = `📋 *Daftar Blacklist Group*\n\n${global.blacklistedGroups.map((id, i) => `${i + 1}. ${id}`).join('\n')}`;
        m.reply(list);
    }
};

// Event handler untuk mengecek jika bot masuk grup blacklist
handler.all = async function (m, { conn }) {
    if (m.isGroup && global.blacklistedGroups.includes(m.chat)) {
        let ownerContact = `wa.me/${global.numberowner}`; // Nomor owner bot

        // Kirim pesan sebelum keluar
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Grup ini masuk dalam daftar blacklist!*\n\nHubungi owner bot untuk menghapus grup ini dari blacklist:\n${ownerContact}\n\nBot akan segera keluar dari grup.`,
        });

        // Keluar dari grup
        await conn.groupLeave(m.chat);
    }
};

// Properti handler
handler.command = /^addblacklist|listblacklist$/i;
handler.tags = ['owner'];
handler.help = ['addblacklist <idgroup>', 'listblacklist'];
handler.owner = true;

module.exports = handler;