let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan teks pencarian`); // Memastikan teks pencarian ada

    await conn.sendMessage(m.chat, {
        react: {
            text: "⌛",
            key: m.key,
        }
    });

    try {
        let cardreels = [];
        let reelsvid = (await axios.get(`https://api.vreden.web.id/api/instagram/reels?query=${encodeURIComponent(text)}`)).data.result.media;

        for (let i = 0; i < 5; i++) {
            const uploadFile = {
                upload: conn.waUploadToServer
            };
            var instareels = await prepareWAMessageMedia({
                video: {
                    url: reelsvid[i].reels.url
                },
            }, uploadFile);

            cardreels.push({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: `
🎥 Play : ${reelsvid[i].statistics.play_count}
❤️ Like : ${reelsvid[i].statistics.like_count}
↗️ Share : ${reelsvid[i].statistics.share_count}
💬 Comment : ${reelsvid[i].statistics.comment_count}
👤 Nickname : ${reelsvid[i].profile.full_name}
👤 Username : ${reelsvid[i].profile.username}
🔗 Links : ${reelsvid[i].reels.video}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "© VRD Team"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: ``,
                    subtitle: "Q100 VRD",
                    videoMessage: instareels.videoMessage,
                    hasMediaAttachment: true
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [{
                        "name": "vreden",
                        "buttonParamsJson": ""
                    }],
                })
            });
        }

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `*Reels Search :*\n${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "© VRD Team"
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "*Reels Search*",
                            subtitle: "Q100 VRD",
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
                            cards: cardreels,
                        })
                    })
                }
            }
        }, {
            quoted: m
        });

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    } catch (error) {
        await m.reply("Terjadi kesalahan");
    }
};

handler.help = ['instareels <teks>', 'instagramreels <teks>', 'reels <teks>'];
handler.tags = ['internet'];
handler.command = /^(instareels|instagramreels|reels)$/i;
handler.limit = true;

module.exports = handler;