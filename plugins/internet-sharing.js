/*
Jangan Hapus Wm Bang 

*Tiktok Auto Search Plugins Cjs*

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VamzFetC6ZvcD1qde90Z/3966
*/

const axios = require("axios");
const FormData = require("form-data");

const ttSearch = async (query, count = 3) => {
    try {
        let d = new FormData();
        d.append("keywords", query);
        d.append("count", count);
        d.append("cursor", 0);
        d.append("web", 1);
        d.append("hd", 1);

        let h = { headers: { ...d.getHeaders() } };
        let { data } = await axios.post("https://tikwm.com/api/feed/search", d, h);

        if (!data.data || !data.data.videos) return [];
        
        const baseURL = "https://tikwm.com";
        return data.data.videos.map(video => ({
            play: baseURL + video.play
        }));
    } catch (e) {
        console.log(e);
        return [];
    }
}

let handler = async (m, { conn }) => {
    let query = "sharing time hanan attaki video";
    let jumlah = 1; // Bisa disesuaikan jumlah video yang ingin diambil

    let videos = await ttSearch(query, jumlah);
    if (!videos.length) return m.reply("Gak nemu videonya, coba kata kunci lain.");

    for (let video of videos) {
        await conn.sendMessage(m.chat, { video: { url: video.play } });
    }
}

// Handler tidak membutuhkan perintah input
handler.help = ['sharing'];
handler.tags = ['search'];
handler.command = ['sharing'];

module.exports = handler;