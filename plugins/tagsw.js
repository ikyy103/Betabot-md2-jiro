let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Example: ${usedPrefix + command} Hello Or Reply Video/Image With Caption: ${usedPrefix + command}`);

    let mediaContent = null;
    let msgOptions = {};
    const BackgroundColor = ['#f68ac9', '#6cace4', '#f44336', '#4caf50', '#ffeb3b', '#9c27b0', '#0d47a1', '#03a9f4', '#9e9e9e', '#ff9800', '#000000', '#ffffff', '#008080', '#FFC0CB', '#A52A2A', '#FFA07A', '#FF00FF', '#D2B48C', '#F5DEB3', '#FF1493', '#B22222', '#00BFFF', '#1E90FF', '#FF69B4', '#87CEEB', '#20B2AA', '#8B0000', '#FF4500', '#48D1CC', '#BA55D3', '#00FF7F', '#008000', '#191970', '#FF8C00', '#9400D3', '#FF00FF', '#8B008B', '#2F4F4F', '#FFDAB9', '#BDB76B', '#DC143C', '#DAA520', '#696969', '#483D8B', '#FFD700', '#C0C0C0'];
    const pickedColor = BackgroundColor[Math.floor(Math.random() * BackgroundColor.length)];
    const jids = [m.sender, m.chat];

    if (m.quoted) {
        const mime = m.quoted.mtype || m.quoted.mediaType;
        if (mime?.includes('image')) {
            mediaContent = await m.quoted.download();
            msgOptions = {
                image: mediaContent,
                caption: text || m.quoted.text || '',
            };
        } else if (mime?.includes('video')) {
            mediaContent = await m.quoted.download();
            msgOptions = {
                video: mediaContent,
                caption: text || m.quoted.text || '',
            };
        } else {
            msgOptions = {
                text: text || m.quoted.text || '',
            };
        }
    } else {
        msgOptions = {
            text: text,
        };
    }

    return conn.sendMessage("status@broadcast", msgOptions, {
        backgroundColor: pickedColor,
        textArgb: 0xffffffff,
        font: 0,
        statusJidList: await (await conn.groupMetadata(m.chat)).participants.map((a) => a.id),
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: jids.map((jid) => ({
                            tag: "to",
                            attrs: { jid: m.chat },
                            content: undefined,
                        })),
                    },
                ],
            },
        ],
    });
};

handler.help = ['tagsw <text>', 'tagsw <reply>'];
handler.tags = ['broadcast'];
handler.command = /^(tagsw)$/i;
handler.limit = true;
handler.owner = true;

module.exports = handler;