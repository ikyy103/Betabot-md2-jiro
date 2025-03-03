const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function sfileSearch(query, page = 1) {
  let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`);
  let $ = cheerio.load(await res.text());
  let result = [];
  $('div.list').each(function () {
    let title = $(this).find('a').text();
    let size = $(this).text().trim().split('(')[1];
    let link = $(this).find('a').attr('href');
    if (link) result.push({ title, size: size.replace(')', ''), link });
  });
  return result;
}

async function sfileDl(url) {
  let res = await fetch(url);
  let $ = cheerio.load(await res.text());
  let filename = $('div.w3-row-padding').find('img').attr('alt');
  let mimetype = $('div.list').text().split(' - ')[1].split('\n')[0];
  let filesize = $('#download').text().replace(/Download File/g, '').replace(/|/g, '').trim();
  let download = $('#download').attr('href') + '&k=' + Math.floor(Math.random() * (15 - 10 + 1) + 10);
  return { filename, filesize, mimetype, download };
}

const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply('Mana link sfile nya');
    let dl = await sfileDl(args[0]);
    let tek = `*[ Downloader Sfile ]* *Filename:* ${dl.filename} *Size:* ${dl.filesize} *Mimetype:* ${dl.mimetype}`;
    let anu = await m.reply(tek);
    let res = await fetch(dl.download);
    let buffer = await res.buffer();
    await conn.sendMessage(m.chat, { document: buffer, mimetype: dl.mimetype, fileName: dl.filename }, { quoted: anu });
  } catch (error) {
    console.error(error);
    m.reply('Error!');
  }
}

handler.command = ['sfile'];
handler.help = ['sfile'];
handler.tags = ['downloader'];
handler.limit = true;

module.exports = handler;