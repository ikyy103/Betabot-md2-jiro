const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`📌 *Gunakan seperti ini:*\n➜ ${usedPrefix + command} https://whatsapp.com/channel/xxxxxxxxxx`);
    if (!text.includes('https://whatsapp.com/channel/')) return m.reply('🚩 *Link tidak valid!*');

    try {
        let result = text.split('https://whatsapp.com/channel/')[1];
        let res = await conn.newsletterMetadata('invite', result);

        let teks = `*🔹 ID:* ${res.id}
*📢 Nama:* ${res.name}
*👥 Total Pengikut:* ${res.subscribers}
*📌 Status:* ${res.state}
*✅ Verifikasi:* ${res.verification == 'VERIFIED' ? 'Terverifikasi' : 'Tidak'}`;

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: teks },
                        footer: { text: 'by Zephyr' },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'cta_copy',
                                    buttonParamsJson: `{"display_text": "Copy ID", "copy_code": "${res.id}"}`
                                }
                            ]
                        }
                    }
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.error(e);
        m.reply('🚩 *Terjadi kesalahan saat mengambil data channel!*');
    }
}

handler.help = ['idch'];
handler.tags = ['tools'];
handler.command = /^idch|cekidch$/i;

module.exports = handler;