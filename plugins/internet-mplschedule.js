const axios = require('axios');
const cheerio = require('cheerio');

async function getJadwalMPL() {
    try {
        const { data } = await axios.get('https://id-mpl.com/schedule');
        const $ = cheerio.load(data);
        let schedule = [];

        $('.match-team-outer').each((i, el) => {
            const team1 = $(el).find('.match-team').first().find('.name').text().trim();
            const team2 = $(el).find('.match-team').last().find('.name').text().trim();
            const time = $(el).find('.match-vs .time').text().trim();

            schedule.push(`⚔️ *${team1}* vs *${team2}*\n🕒 *Waktu:* ${time}\n`);
        });

        return schedule.length ? schedule.join('\n') : '⚠️ Tidak ada jadwal pertandingan saat ini.';
    } catch (error) {
        console.error('Error saat scraping jadwal:', error);
        return '⚠️ Terjadi kesalahan saat mengambil jadwal MPL.';
    }
}

let handler = async (m, { conn }) => {
    let result = await getJadwalMPL();
    m.reply(`📅 *Jadwal MPL ID:*\n\n${result}`);
};

handler.help = ['mplschedule'];
handler.tags = ['internet'];
handler.command = /^(mplschedule)$/i;

module.exports = handler;