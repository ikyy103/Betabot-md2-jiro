const axios = require('axios');

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("❌ *Masukkan judul lagu!*");

    try {
        // 🔍 Ambil data lagu dari API Fast Rest
        let response = await axios.get(`https://fastrestapis.fasturl.cloud/music/songlyrics-v1?text=${encodeURIComponent(text)}`);

        // Cek apakah data tersedia
        if (!response.data || response.data.status !== 200 || !response.data.result) {
            return m.reply("⚠️ *Lagu tidak ditemukan atau API sedang error!*");
        }

        let result = response.data.result;
        let song = result.answer || {};
        let youtubeURL = result.Youtube_URL || null;

        // 🔍 Jika YouTube URL tidak ditemukan, cari manual di YouTube
        if (!youtubeURL) {
            let ytSearch = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(text)}&key=YOUR_YOUTUBE_API_KEY&type=video&maxResults=1`);
            if (ytSearch.data.items.length > 0) {
                youtubeURL = `https://www.youtube.com/watch?v=${ytSearch.data.items[0].id.videoId}`;
            } else {
                return m.reply("⚠️ *Lagu tidak ditemukan di YouTube!*");
            }
        }

        // 🔄 Konversi YouTube URL ke MP3 menggunakan API ytmp3.cc
        let mp3Url = null;
        try {
            let convertResponse = await axios.get(`https://ytmp3.cc/api/v2/convert?url=${youtubeURL}`);
            if (convertResponse.data.status && convertResponse.data.result && convertResponse.data.result.mp3) {
                mp3Url = convertResponse.data.result.mp3;
            }
        } catch (err) {
            console.log("⚠️ Gagal mengonversi YouTube ke MP3, mencari alternatif...");
        }

        // Jika MP3 masih tidak ditemukan, coba API BetaBotz
        if (!mp3Url) {
            try {
                let backupConvert = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${youtubeURL}&apikey=YOUR_BETABOTZ_API_KEY`);
                if (backupConvert.data.status && backupConvert.data.result.mp3) {
                    mp3Url = backupConvert.data.result.mp3;
                }
            } catch (err) {
                console.log("⚠️ Gagal mendapatkan MP3 dari BetaBotz.");
            }
        }

        // 📝 Buat caption dengan informasi lagu
        let caption = `🎵 *${song.song_name || text}*\n👤 *Artis:* ${song.artist_name || "Tidak diketahui"}\n📀 *Tahun:* ${result.year || "Tidak diketahui"}\n🔗 *[YouTube](${youtubeURL})*\n🎤 *Lirik:* ${song.lyrics || "Tidak tersedia"}`;

        // 📤 Kirim gambar album + informasi lagu
        await conn.sendMessage(m.chat, {
            image: { url: song.album_artwork_url || "https://i.imgur.com/Ou7O8ko.png" },
            caption: caption
        }, { quoted: m });

        // 🎧 Jika MP3 tersedia, kirim audio
        if (mp3Url) {
            await conn.sendMessage(m.chat, {
                audio: { url: mp3Url },
                mimetype: 'audio/mpeg'
            }, { quoted: m });
        } else {
            m.reply("⚠️ *Gagal mendapatkan audio. Hanya mengirimkan informasi lagu.*");
        }

    } catch (error) {
        console.error("❌ Error Fetching Data:", error);
        m.reply("⚠️ *Terjadi kesalahan saat mengambil data! Coba lagi nanti.*");
    }
};

handler.help = ['lyricsmusic <judul lagu>'];
handler.tags = ['music'];
handler.command = /^lyricsmusic$/i;

module.exports = handler;