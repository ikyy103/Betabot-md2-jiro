/*
Jangan Hapus Wm Bang 

*Search Lirik Plugins CJS*

Bertenaga Gugel

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZERvida
*/

const cheerio = require("cheerio");

async function googleLyrics(judulLagu) {
  try {
    const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=liirk+lagu+${encodeURIComponent(judulLagu)}&hl=en`, {
      headers: {
        'x-return-format': 'html',
        'x-engine': 'cf-browser-rendering',
      }
    });
    const text = await response.text();
    const $ = cheerio.load(text);
    const lirik = [];
    const output = [];
    const result = {};
    
    $('div.PZPZlf').each((i, e) => {
      const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
      if (!penemu) output.push($(e).text().trim());
    });

    $('div[jsname="U8S5sf"]').each((i, el) => {
      let out = '';
      $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
        out += $(span).text() + '\n';
      });
      lirik.push(out.trim());
    });

    result.lyrics = lirik.join('\n\n');
    result.title = output.shift();
    result.subtitle = output.shift();
    result.platform = output.filter(_ => !_.includes(':'));
    output.forEach(_ => {
      if (_.includes(':')) {
        const [name, value] = _.split(':');
        result[name.toLowerCase()] = value.trim();
      }
    });
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

const handler = async (m, { text }) => {
  if (!text) return m.reply('Masukkan judul lagu yang ingin dicari liriknya.');
  
  try {
    const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=liirk+lagu+${encodeURIComponent(text)}&hl=en`, {
      headers: {
        'x-return-format': 'html',
        'x-engine': 'cf-browser-rendering',
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const lirik = [];
    const output = [];
    const result = {};
    
    $('div.PZPZlf').each((i, e) => {
      const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
      if (!penemu) output.push($(e).text().trim());
    });

    $('div[jsname="U8S5sf"]').each((i, el) => {
      let out = '';
      $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
        out += $(span).text() + '\n';
      });
      lirik.push(out.trim());
    });

    result.lyrics = lirik.join('\n\n');
    result.title = output.shift();
    result.subtitle = output.shift();
    result.platform = output.filter(_ => !_.includes(':'));
    output.forEach(_ => {
      if (_.includes(':')) {
        const [name, value] = _.split(':');
        result[name.toLowerCase()] = value.trim();
      }
    });

    if (!result.lyrics) return m.reply('Lirik tidak ditemukan.');

    let pesan = `*Title :* ${result.title}\n`;
    if (result.subtitle) pesan += `*Subtitle :* ${result.subtitle}\n`;
    if (result.platform.length) pesan += `*Platform :* ${result.platform.join(', ')}\n`;
    Object.keys(result).forEach(key => {
      if (!['lyrics', 'title', 'subtitle', 'platform'].includes(key)) {
        pesan += `*${key.replace(/_/g, ' ')} :* ${result[key]}\n`;
      }
    });
    pesan += `\n*Lyrics :*\n${result.lyrics}`;

    m.reply(pesan);
  } catch (e) {
    m.reply('Terjadi kesalahan saat mengambil lirik.');
  }
};

handler.help = ['lirik'];
handler.command = ['lirik'];
handler.tags = ['internet'];

module.exports = handler;