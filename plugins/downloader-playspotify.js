let axios = require('axios');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || args.length === 0) {
        return m.reply(`🎵 Masukkan judul lagu yang ingin diputar\n*Contoh:* ${usedPrefix + command} JKT48 Heavy Rotation`);
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        const { thumbnail, title, author, audio } = await spotifySong(args.join(" "));
        if (!audio) {
            return m.reply('❌ Lagu tidak ditemukan atau tidak bisa diunduh');
        }

        let messageText = `🎧 *SPOTIFY PLAY*\n\n🎵 *Judul:* ${title}\n👤 *Artis:* ${author}\n\n_Sedang mengirim audio, mohon tunggu..._`;

        await conn.sendMessage(m.chat, { 
            text: messageText,
            contextInfo: {
                externalAdReply: {
                    title: '乂 Spotify Downloader 乂',
                    body: `${title} - ${author}`,
                    thumbnailUrl: thumbnail,
                    sourceUrl: 'https://open.spotify.com',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        // Kirim audio
        await conn.sendMessage(m.chat, { 
            audio: { url: audio }, 
            mimetype: 'audio/mpeg', 
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: author,
                    thumbnailUrl: thumbnail,
                    sourceUrl: 'https://open.spotify.com',
                    mediaType: 1
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Error in spotify play:', error);
        await m.reply('❌ Gagal mengunduh lagu. Silakan coba lagi nanti.');
    }
};

handler.help = ['playspotify <judul lagu>'];
handler.tags = ['downloader'];
handler.command = /^(playspotify)$/i;
handler.limit = false;

module.exports = handler;

async function spotifySong(query) {
    try {
        const { data: searchData } = await axios.get('https://fastrestapis.fasturl.cloud/music/spotify', {
            params: { name: query }
        });

        if (!searchData?.result?.[0]?.url) {
            throw new Error('Lagu tidak ditemukan');
        }

        const apiUrl = 'https://fastrestapis.fasturl.cloud/downup/spotifydown';
        const { data: apiResponse } = await axios.get(apiUrl, {
            params: { url: searchData.result[0].url },
            headers: { accept: 'application/json' }
        });

        if (apiResponse.status !== 200 || !apiResponse.result.success) {
            throw new Error('Lagu tidak ditemukan atau gagal diproses');
        }

        const metadata = apiResponse.result.metadata;
        const downloadLink = apiResponse.result.link;

        if (!downloadLink) {
            throw new Error('Gagal mendapatkan link unduhan');
        }

        return {
            thumbnail: metadata.cover || `${globalThis.ppUrl}`,
            title: metadata.title || query,
            author: metadata.artists || 'Unknown Artist',
            audio: downloadLink
        };

    } catch (error) {
        console.error('Error in spotifySong:', error);
        throw error;
    }
}