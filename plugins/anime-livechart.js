/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Contributor by : shannz (scrape) 
 • Livechart Search
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const cheerio = require('cheerio');
const axios = require('axios');

const handler = async (m, {
    conn,
    args
}) => {
    if (!args[0]) {
        return conn.sendMessage(m.chat, {
            text: "namanya mana!"
        }, {
            quoted: m
        });
    }

    const query = args.join(' ');
    const searchURL = `https://www.livechart.me/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(searchURL, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "Referer": "https://www.livechart.me/search",
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const animeList = [];

        $('.callout.grouped-list.anime-list li.grouped-list-item.anime-item').each((index, element) => {
            const title = $(element).find('.anime-item__body__title a').text().trim();
            const release = $(element).find('.info span[data-action="click->anime-item#showPremiereDateTime"]').text().trim();
            const rating = $(element).find('.info .fake-link').text().trim();
            const url = $(element).find('.anime-item__body__title a').attr('href');
            const type = $(element).find('.anime-item__body__title span.title-extra').text().trim();
            const imageUrl = $(element).find('.anime-item__poster-wrap img').attr('src');

            animeList.push({
                title,
                release,
                rating,
                url: `https://www.livechart.me${url}`,
                type,
                imageUrl
            });
        });

        if (animeList.length === 0) {
            return conn.sendMessage(m.chat, {
                text: "Anime tidak ditemukan!"
            }, {
                quoted: m
            });
        }
        
        const list = animeList.map((anime, index) => (
            `- 📚 *${index + 1}. ${anime.title}*\n` +
            `- 📅 *Release:* ${anime.release}\n` +
            `- ⭐ *Rating:* ${anime.rating}\n` +
            `- 📺 *Type:* ${anime.type}\n` +
            `- 🔗 *URL:* ${anime.url}\n`
        )).join('\n\n');

        conn.sendMessage(m.chat, {
            text: list,
            contextInfo: {
                externalAdReply: {
                    title: "LiveChart Search",
                    body: "Hasil pencarian anime",
                    thumbnailUrl: animeList[0].imageUrl || null,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: searchURL,
                },
            },
        }, {
            quoted: m
        });

    } catch (error) {
        conn.sendMessage(m.chat, {
            text: `${error.message}`
        }, {
            quoted: m
        });
    }
};

handler.command = ['livechart'];
handler.tags = ['anime'];
handler.help = ['livechart <query> '];
handler.limit = true;
handler.register = true

module.exports = handler;