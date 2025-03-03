const msToTime = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours ? `${hours} jam ` : ''}${minutes ? `${minutes} menit ` : ''}${seconds ? `${seconds} detik` : ''}`.trim();
};

let handler = async (m, { conn, args }) => {
    if (!args[0] || isNaN(args[0])) throw 'Masukkan durasi dalam menit!\n\nContoh: .takedownall 10';

    let duration = parseInt(args[0]) * 60 * 1000; // Ubah menit ke milidetik
    let now = Date.now();
    let resumeTime = new Date(now + duration);

    // ID grup yang tidak boleh ditakedown
    const exemptGroup = '120363347063028657@g.us';

    // Ambil seluruh grup yang terhubung dengan bot
    let groups = Object.entries(conn.chats)
        .filter(([id, data]) => id.endsWith('@g.us') && id !== exemptGroup && data.isChats);

    if (groups.length === 0) throw 'Tidak ada grup yang dapat ditakedown (semua grup sudah dalam pengecualian atau tidak ada grup aktif).';

    // Proses takedown untuk setiap grup
    for (let [groupId, groupData] of groups) {
        // Tandai grup sebagai banned
        global.db.data.chats[groupId].isBanned = true;

        // Kirim pesan pemberitahuan di grup
        let groupMetadata = await conn.groupMetadata(groupId).catch(() => null);
        let message = `⚠️ *Grup ini sedang ditakedown oleh owner karena terdeteksi spam.*\n\nGrup akan kembali aktif pada *${resumeTime.toLocaleTimeString()}*.`;
        if (groupMetadata) {
            await conn.reply(groupId, message, m);
        }
    }

    // Kirim laporan ke owner
    let report = `✅ Takedown berhasil dilakukan pada grup berikut (kecuali grup dengan ID ${exemptGroup}):\n\n` +
        groups.map(([id]) => `• ${id}`).join('\n');
    await conn.reply(m.chat, report, m);

    // Set timer untuk melepas banned
    setTimeout(async () => {
        for (let [groupId, groupData] of groups) {
            // Lepas banned
            global.db.data.chats[groupId].isBanned = false;

            // Kirim pesan bahwa grup aktif kembali
            await conn.reply(groupId, '✅ Grup ini sudah aktif kembali. Mohon untuk menjaga aktivitas grup agar tidak dianggap spam.', m);
        }
    }, duration);
};

handler.help = ['takedownall <durasi dalam menit>'];
handler.tags = ['owner'];
handler.command = /^takedownall$/i;
handler.owner = true;

module.exports = handler;