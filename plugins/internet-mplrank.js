const axios = require('axios');
const cheerio = require('cheerio');

async function getPeringkatMPL() {
    try {
        const { data } = await axios.get('https://id-mpl.com/');
        const $ = cheerio.load(data);

        const rows = $('.table-standings tbody tr');
        let rankings = [];

        rows.each((i, el) => {
            const cleanText = (selector) => $(el).find(selector).first().text().replace(/\s+/g, ' ').trim();

            const rank = cleanText('td.team-info .team-rank');
            const team = cleanText('td.team-info .team-name span.d-lg-block');
            const matchPoint = cleanText('td:nth-child(2)');
            const matchWL = cleanText('td:nth-child(3)');
            const netGameWin = cleanText('td:nth-child(4)');
            const gameWL = cleanText('td:nth-child(5)');

            rankings.push(
                `🏆 *${rank}.* ${team}\n   🔹 *Poin:* ${matchPoint}\n   🔸 *Match W/L:* ${matchWL}\n   🔹 *Net Win:* ${netGameWin}\n   🔸 *Game W/L:* ${gameWL}\n`
            );
        });

        return rankings.length ? rankings.join('\n') : '⚠️ Data peringkat tidak tersedia.';
    } catch (error) {
        console.error('Error saat scraping peringkat:', error);
        return '⚠️ Terjadi kesalahan saat mengambil peringkat MPL.';
    }
}

let handler = async (m, { conn }) => {
    let result = await getPeringkatMPL();
    m.reply(`🏆 *Peringkat MPL ID Saat Ini:*\n\n${result}`);
};

handler.help = ['mplrank'];
handler.tags = ['internet'];
handler.command = /^(mplrank)$/i;

module.exports = handler;