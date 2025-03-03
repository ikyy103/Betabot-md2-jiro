/*
  Plugin Shutterstock Search
  Scraper by Hann
*/

const axios = require('axios');
const cheerio = require('cheerio');

async function shutterShockSearch(query) {
    try {
        const { data } = await axios.get('https://www.shutterstock.com/id/search/' + encodeURIComponent(query), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $('a.mui-t7xql4-a-inherit-link').each((index, element) => {
            const title = $(element).attr('aria-label');
            const href = $(element).attr('href');
            const imageUrl = $(element).find('img').attr('src');

            if (title && href) {
                results.push({
                    title: title,
                    link: `https://www.shutterstock.com${href}`,
                    imageUrl: imageUrl || ''
                });
            }
        });

        return results;
    } catch (error) {
        return { error: error.message };
    }
}

const handler = async (m, { text, args, command }) => {
    try {
        if (command === 'shutterstock') {
            if (!text) return m.reply('Masukkan kata kunci pencarian! Contoh: .shutterstock anime');

            const results = await shutterShockSearch(text);
            if (!results || results.length === 0) return m.reply(`Tidak ditemukan hasil untuk "${text}".`);

            let response = `📸 Hasil Pencarian Shutterstock untuk "${text}":\n\n`;
            results.slice(0, 5).forEach((item, i) => {
                response += `${i + 1}. **${item.title}**\n   🔗 [Lihat Gambar](${item.link})\n   ![Image](${item.imageUrl})\n\n`;
            });

            m.reply(response.trim());
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat mengambil data.');
    }
};

handler.command = ['shutterstock'];
handler.tags = ['search'];
handler.limit = true;

module.exports = handler;