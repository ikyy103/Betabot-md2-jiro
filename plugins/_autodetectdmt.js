const { WAMessageStubType } = require('@whiskeysockets/baileys');

async function before(m) {
    const fkon = {
        key: { participant: "0@s.whatsapp.net" },
        message: {
            contactMessage: {
                displayName: this.getName(this.user.jid),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;Bot,;;;\nFN:Bot,\nitem1.TEL;waid=${this.user.jid.split("@")[0]}:${this.user.jid.split("@")[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`,
                jpegThumbnail: null,
                thumbnail: null,
                sendEphemeral: false,
            },
        },
    };

    if (!m.messageStubType || !m.isGroup) return;
    let edtr = `@${m.sender.split('@')[0]}`; // Perbaikan di sini

    if (m.messageStubType === 29) {
        await this.sendMessage(m.chat, {
            text: `${edtr} telah menjadikan @${m.messageStubParameters[0].split('@')[0]} sebagai admin.`,
            mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]
        }, {
            quoted: fkon
        });
    } else if (m.messageStubType === 30) {
        await this.sendMessage(m.chat, {
            text: `${edtr} telah memberhentikan @${m.messageStubParameters[0].split('@')[0]} dari admin.`,
            mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]
        }, {
            quoted: fkon
        });
    } else {
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType],
        });
    }
}

const disabled = false;

module.exports = { before, disabled };