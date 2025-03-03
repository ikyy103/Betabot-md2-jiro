const fetch = require("node-fetch");
const { generateWAMessageFromContent, jidNormalizedUser  } = require("@adiwajshing/baileys");

let handler = async (m, { conn }) => {
    // Mendapatkan daftar grup
    let groupIds = Object.keys(conn.chats).filter(chatId => conn.chats[chatId].isGroup);
    
    // Mengambil status JID
    let statusJidList = [];
    if (conn.user && conn.user.jid) {
        statusJidList.push(jidNormalizedUser (conn.user.jid));
    }

    // Pastikan conn.contacts ada
    if (conn.contacts) {
        statusJidList.push(
            ...Object.values(conn.contacts)
                .filter(v => v.isContact)
                .map(v => v.id)
        );
    }

    let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
    let fonts = [0, 1, 2, 6, 7, 8, 9, 10];

    if (!m.quoted) return m.reply('Mana text atau media yang ingin di-upload?');

    if (!m.quoted.isMedia) {
        let text = m.text || m.quoted?.body || '';
        if (!text) return m.reply('Mana text?');

        let message = await generateWAMessageFromContent(m.chat, {
            text: text,
            mentions: statusJidList // Menggunakan 'mentions' untuk menyebutkan pengguna
        }, { quoted: m });

        message.message.statusJidList = statusJidList;
        message.message.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        message.message.textArgb = 0xffffffff;
        message.message.font = fonts[Math.floor(Math.random() * fonts.length)];

        // Mengirim pesan ke semua grup
        for (let groupId of groupIds) {
            await conn.relayMessage(groupId, message.message, {});
        }
        await m.reply(`Up status ke : ${groupIds.length} Grup`);
    } else if (/audio/.test(m.quoted.msg.mimetype)) {
        let audioData = await downloadM();
        for (let groupId of groupIds) {
            await conn.sendMessage(
                groupId,
                {
                    audio: audioData,
                    mimetype: 'audio/mp4',
                    ptt: true,
                    waveform: [100, 0, 100, 0, 100, 0, 100],
                },
                { contextInfo: { mentionedJid: statusJidList } } // Menambahkan contextInfo
            );
        }
        await m.reply(`Up status audio ke : ${groupIds.length} Grup`);
    } else {
        let type = /image/.test(m.quoted.msg.mimetype) ? 'image' : /video/.test(m.quoted.msg.mimetype) ? 'video' : false;
        if (!type) return m.reply('Type tidak didukung');

        let mediaData = await downloadM();
        for (let groupId of groupIds) {
            await conn.sendMessage(
                groupId,
                {
                    [type]: mediaData,
                    caption: m.text || m.quoted?.body || '',
                },
                { contextInfo: { mentionedJid: statusJidList } } // Menambahkan contextInfo
            );
        }
        await m.reply(`Up status ke : ${groupIds.length} Grup`);
    }
}

handler.help = ["upswtag"];
handler.tags = ["owner"];
handler.command = /^upswtag$/;
handler.owner = true;

module.exports = handler;