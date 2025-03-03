const fetch = require('node-fetch');
const cheerio = require('cheerio');

let handler = async (m, { conn, command }) => {
    const mess = {
        wait: 'Tunggu sebentar, sedang mencari video...'
    };
    
    m.reply(mess.wait); 

    async function animeVideo() {
        const url = 'https://shortstatusvideos.com/anime-video-status-download/'; // URL untuk mengambil video
        const response = await fetch(url); // Mengambil data dari URL
        const html = await response.text(); // Mengambil HTML dari response
        const $ = cheerio.load(html); // Memuat HTML ke cheerio
        const videos = []; // Array untuk menyimpan video
        
        $('a.mks_button.mks_button_small.squared').each((index, element) => {
            const href = $(element).attr('href'); // Mengambil link video
            const title = $(element).closest('p').prevAll('p').find('strong').text(); // Mengambil judul video
            videos.push({
                title,
                source: href
            });
        });
        
        const randomIndex = Math.floor(Math.random() * videos.length);
        const randomVideo = videos[randomIndex];
        return randomVideo; // Mengembalikan video yang dipilih
    }

    const video = await animeVideo();
    if (video) {
        let aras = (`Judul: ${video.title}\nLink: ${video.source}`); 
        await conn.sendMessage(m.chat, { video: { url: `${video.source}` }, caption: aras, mimetype: "video/mp4" }, { quoted: m });
    } else {
        m.reply("Tidak ada video yang ditemukan!!"); 
    }
};

handler.help = ['play-anime'];
handler.tags = ['anime'];
handler.command = /^(play-anime)$/i;
handler.limit = true;

module.exports = handler;