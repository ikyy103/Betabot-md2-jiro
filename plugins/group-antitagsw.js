let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply("Fitur ini hanya dapat digunakan dalam grup.");
    if (!(isAdmin || isOwner)) return m.reply("Maaf, fitur ini hanya dapat digunakan oleh admin grup.");

    global.db.data.chats = global.db.data.chats || {};
    global.db.data.users = global.db.data.users || {}; // Menyimpan data warn pengguna

    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {};
    }

    if (!args[0]) return m.reply("Silakan gunakan: .antitagsw *on/off*");

    if (args[0] === "on") {
        if (global.db.data.chats[m.chat].antitagsw) return m.reply("Fitur Anti Tag Status WhatsApp sudah aktif di grup ini.");
        global.db.data.chats[m.chat].antitagsw = true;
        return m.reply("*Anti Tag Status WhatsApp* berhasil diaktifkan dalam grup ini.");
    } else if (args[0] === "off") {
        if (!global.db.data.chats[m.chat].antitagsw) return m.reply("Fitur Anti Tag Status WhatsApp sudah nonaktif di grup ini.");
        global.db.data.chats[m.chat].antitagsw = false;
        return m.reply("*Anti Tag Status WhatsApp* berhasil dinonaktifkan dalam grup ini.");
    } else {
        return m.reply("Mohon pilih opsi yang valid: *on/off*");
    }
};

handler.before = async (m, { conn, isBotAdmin, isAdmin }) => {
    global.db.data.chats = global.db.data.chats || {};
    global.db.data.users = global.db.data.users || {};

    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {};
    }
    
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = { warn: 0 };
    }

    if (!m.isGroup || !global.db.data.chats[m.chat].antitagsw) return;

    const isTaggingInStatus = (
        m.mtype === 'groupStatusMentionMessage' || 
        (m.quoted && m.quoted.mtype === 'groupStatusMentionMessage') ||
        (m.message && m.message.groupStatusMentionMessage) ||
        (m.message && m.message.protocolMessage && m.message.protocolMessage.type === 25)
    );

    if (!isTaggingInStatus) return;

    await conn.sendMessage(m.chat, { delete: m.key });

    if (isAdmin) {
        return conn.sendMessage(m.chat, { 
            text: `@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp.\nPesan telah dihapus.`, 
            mentions: [m.sender] 
        });
    }

    global.db.data.users[m.sender].warn += 1;

    if (global.db.data.users[m.sender].warn >= 2) {
        if (isBotAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            return conn.sendMessage(m.chat, { 
                text: `@${m.sender.split("@")[0]} telah dikeluarkan dari grup karena menandai grup dalam status WhatsApp sebanyak 2 kali.`, 
                mentions: [m.sender] 
            });
        } else {
            return conn.sendMessage(m.chat, { 
                text: `@${m.sender.split("@")[0]}, kamu sudah mencapai 2 peringatan karena menandai grup dalam status WhatsApp.\nNamun, bot bukan admin, jadi kamu tidak dapat dikeluarkan.`, 
                mentions: [m.sender] 
            });
        }
    } else {
        return conn.sendMessage(m.chat, { 
            text: `@${m.sender.split("@")[0]}, kamu telah mendapatkan *1 peringatan* karena menandai grup dalam status WhatsApp.\nJika mencapai 2 peringatan, kamu akan dikeluarkan!`, 
            mentions: [m.sender] 
        });
    }
};

handler.command = ['antitagsw'];
handler.help = ['antitagsw'].map(a => a + ' *on/off*');
handler.tags = ['group'];
handler.group = true;
handler.admin = true;

module.exports = handler;