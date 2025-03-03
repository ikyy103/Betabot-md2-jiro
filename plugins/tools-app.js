const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchApp = async (query) => {
  const response = await fetch(`(link unavailable));
  const html = await response.text();
  const $ = cheerio.load(html);
  const results = [];

  $('article.ap-post.ap-lay-c').each((index, element) => {
    const title = $(element).find('.entry-title').text();
    const link = $(element).find('a').attr('href');
    const image = $(element).find('.meta-image img').attr('src');
    const version = $(element).find('.entry-excerpt').text();
    results.push({ title, link, image, version });
  });

  return results;
};

const getDownloadInfo = async (url) => {
  const hasQueryString = url.includes('?');
  const hasDownloadFileParam = url.includes('?download&file=0');
  url = !hasQueryString ? url + '?download&file=0' : !hasDownloadFileParam ? url + '&download&file=0' : url;

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  let title, links, image, description, author;

  $('meta[property]').each((index, element) => {
    const property = $(element).attr('property');
    const content = $(element).attr('content');
    switch (property) {
      case 'og:title':
        title = content;
        break;
      case 'og:url':
        links = content;
        break;
      case 'og:image':
        image = content;
        break;
      case 'og:description':
        description = content;
        break;
      case 'article:author':
        author = content;
        break;
    }
  });

  const linkElement = $('a#download-now');
  const link = linkElement.attr('href');
  const info = linkElement.find('.progress-text').text().trim();

  return { link, info, detail: { title, links, image, description, author } };
};

const handler = async (m, { command, args }) => {
  if (command === 'searchapp') {
    if (!args.length) return m.reply("❌ Harap masukkan kata kunci pencarian!");
    const query = args.join(' ');
    try {
      const results = await searchApp(query);
      if (!results.length) return m.reply("❌ Tidak ada hasil yang ditemukan!");
      const responseMessage = results
        .map((result, index) => `*${index + 1}. ${result.title}*\nVersi: ${result.version}\n[Link Download](${result.link})\n`)
        .join('\n\n');
      m.reply(responseMessage);
    } catch {
      m.reply("Terjadi kesalahan saat mencari aplikasi!");
    }
  }

  if (command === 'getdownload') {
    if (!args.length) return m.reply("Mana URL?");
    const url = args[0];
    try {
      const downloadInfo = await getDownloadInfo(url);
      const responseMessage = `*Judul*: ${downloadInfo.detail.title}\n*Deskripsi*: ${downloadInfo.detail.description}\n*Penulis*: ${downloadInfo.detail.author}\n\n*Link Download*: ${downloadInfo.link}\n*Info*: ${downloadInfo.info}`;
      m.reply(responseMessage);
    } catch {
      m.reply("Terjadi kesalahan saat mendapatkan informasi download!");
    }
  }
};

handler.command = ['searchapp', 'getdownload'];
handler.tags = ['tools'];
handler.help = ['searchapp <query>', 'getdownload <url>'];

module.exports = handler;