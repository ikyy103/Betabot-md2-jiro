const axios = require("axios");

var handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw 'Masukkan judul lagu yang ingin dicari!';

    try {
        // 1. Mencari video berdasarkan judul menggunakan Fast Rest API
        let searchUrl = `https://fastrestapis.fasturl.cloud/downup/ytdown?name=${encodeURIComponent(text)}&format=mp4&quality=720`;
        let searchResponse = await axios.get(searchUrl);
        let searchData = searchResponse.data;

        if (!searchData || !searchData.result || searchData.result.length === 0) {
            throw 'Video tidak ditemukan!';
        }

        // Ambil video pertama dari hasil pencarian
        let video = searchData.result[0];
        let videoTitle = video.title;
        let videoUrl = video.url;
        let videoThumb = video.img;
        let videoAuthor = video.author.name;
        let videoChannel = video.author.url;

        // 2. Konversi video ke MP3 menggunakan BetaBotz API
        let convertUrl = `https://api.betabotz.eu.org/api/download/ytmp3?url=${videoUrl}&apikey=${lann}`;
        let convertResponse = await axios.get(convertUrl);
        let convertData = convertResponse.data;

        if (!convertData || !convertData.result || !convertData.result.mp3) {
            throw 'Gagal mengonversi audio!';
        }

        let audioUrl = convertData.result.mp3;
        let duration = convertData.result.duration;
        let description = convertData.result.description;

        // 3. Kirim informasi video ke pengguna
        let caption = `🎵 *Judul:* ${videoTitle}\n👤 *Author:* ${videoAuthor}\n🔗 *Channel:* ${videoChannel}\n⏳ *Durasi:* ${duration} detik\n📌 *Deskripsi:* ${description}`;

        await conn.sendMessage(m.chat, {
            image: { url: videoThumb },
            caption: caption
        }, { quoted: m });

        // 4. Kirim file audio MP3
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: videoTitle,
                    body: "Klik untuk menonton di YouTube",
                    thumbnailUrl: videoThumb,
                    sourceUrl: videoUrl,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        // 5. Menambahkan bagian buttons
        let teksnya = "📽 *Hasil Pencarian YouTube*\n\nPilih salah satu untuk mendengarkan atau menonton:";
        
        let sections = [];
        let addedTitles = new Set();

        sections.push({
            "title": videoTitle,
            "rows": [
                {
                    "title": "🎶 Play Audio",
                    "description": `📢 ${videoAuthor} • ⏳ ${duration}`,
                    "id": `.xytmp3 ${videoUrl}`
                },
                {
                    "title": "📺 Play Video",
                    "description": `📢 ${videoAuthor} • ⏳ ${duration}`,
                    "id": `.xytmp4 ${videoUrl}`
                }
            ]
        });

        let msgii = generateWAMessageFromContent(m.chat, { 
            viewOnceMessage: { 
                message: { 
                    "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 }, 
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true }}, 
                        body: proto.Message.InteractiveMessage.Body.create({ text: teksnya }), 
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: global.foother }), 
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
                            buttons: [{
                                "name": "single_select",
                                "buttonParamsJson": `{ "title": "Pilih Opsi", "sections": ${JSON.stringify(sections)} }`
                            }]
                        })
                    }) 
                } 
            }
        }, { userJid: m.sender, quoted: null }); 

        await conn.relayMessage(msgii.key.remoteJid, msgii.message, { messageId: msgii.key.id });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `❌ *Error:* ${e.message || e}`, m);
    }
};

handler.command = handler.help = ['play3'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = 3;
handler.premium = false;
handler.group = false;

module.exports = handler;