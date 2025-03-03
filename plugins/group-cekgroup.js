const { delay } = require('@adiwajshing/baileys');

let handler = async (m, { conn }) => {
    if (!m.isGroup) throw "❌ Fitur ini hanya dapat digunakan di grup.";

    const chatId = m.chat;
    const groupMetadata = await conn.groupMetadata(chatId);
    const groupAdmins = groupMetadata.participants.filter(p => p.admin);
    const groupOwner = groupMetadata.owner || "Tidak diketahui";
    const groupName = groupMetadata.subject;
    const groupCreation = new Date(groupMetadata.creation * 1000).toLocaleString();
    const totalMembers = groupMetadata.participants.length;
    const totalAdmins = groupAdmins.length;
    const adminList = groupAdmins.map(a => `wa.me/${a.id.split('@')[0]}`).join('\n');
    const requestCount = (global.groupRequests[chatId] || []).length || 0;

    // Hitung request per menit
    const requestsPerMinute = (global.groupRequests[chatId] || []).filter(
        t => Date.now() - t < 60 * 1000
    ).length;

    // Tentukan status spam
    const isSpam = requestsPerMinute > 10; // Batas request per menit untuk dianggap spam

    // Tampilkan informasi grup
    const report = `
📊 *Cek Grup*

📂 *Detail Grup*
📌 Nama Grup: ${groupName}
📌 ID Grup: ${chatId}
📌 Dibuat pada: ${groupCreation}
📌 Pembuat Grup: wa.me/${groupOwner.split('@')[0]}
📌 Jumlah Member: ${totalMembers}
📌 Jumlah Admin: ${totalAdmins}

👮‍♂️ *Admin Aktif*
${adminList}

📈 *Statistik Request*
🔹 Total Request: ${requestCount}
🔹 Request Per Menit: ${requestsPerMinute}

🚨 *Status Grup: ${isSpam ? "SPAM ❌" : "AMAN ✅"}*
`.trim();

    // Kirim laporan ke grup
    await conn.sendMessage(chatId, { text: report }, { quoted: m });

    if (isSpam) {
        // Jika grup termasuk spam, kirim peringatan dan ban selama 5 menit
        const banMessage = `*⏳ Grup ini terdeteksi sebagai SPAM!*\nBot akan off dalam grup ini selama 5 menit.`;
        await conn.sendMessage(chatId, { text: banMessage }, { quoted: m });

        // Ban grup selama 5 menit
        global.db.data.chats[chatId].isBanned = true;
        await delay(5 * 60 * 1000); // Delay 5 menit

        // Lepas ban setelah 5 menit
        global.db.data.chats[chatId].isBanned = false;
        const unbanMessage = `*✅ Bot telah kembali aktif di grup ini.*`;
        await conn.sendMessage(chatId, { text: unbanMessage }, { quoted: m });
    }
};

// Middleware untuk mencatat setiap request
if (!global.groupRequests) global.groupRequests = {};

let addRequest = async (m) => {
    if (!m.isGroup) return;
    const chatId = m.chat;
    if (!global.groupRequests[chatId]) global.groupRequests[chatId] = [];
    global.groupRequests[chatId].push(Date.now());
};

// Middleware utama untuk memblokir respons bot di grup yang sedang di-banned
conn.ev.on('messages.upsert', async ({ messages }) => {
    for (let msg of messages) {
        if (msg.key && msg.key.remoteJid && global.db.data.chats[msg.key.remoteJid]?.isBanned) {
            console.log(`⛔ Bot tidak merespons karena grup ${msg.key.remoteJid} sedang di-banned.`);
            continue; // Abaikan pesan jika grup sedang di-banned
        }
        if (msg.message) addRequest(msg);
    }
});

handler.help = ['cekgroup'];
handler.tags = ['admin', 'tools'];
handler.command = /^cekgroup$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;