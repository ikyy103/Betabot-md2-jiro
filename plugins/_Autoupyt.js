const fetch = require("node-fetch");
const schedule = require("node-schedule");

const handler = (m) => m;
let youtubeUpdateJobs = [];

handler.before = async function (m, { conn }) {
  let chats = global.db.data.chats[m.chat];
  let db = global.db.data.bots;

  const channelUrls = [
    "https://youtube.com/@SatriaHubDeals"
  ];

  if (chats.youtubeUpdate) {
    // Batalkan semua jadwal yang ada sebelumnya
    youtubeUpdateJobs.forEach((job) => job.cancel());
    youtubeUpdateJobs = [];

    // Buat jadwal untuk setiap kanal
    channelUrls.forEach((channelUrl) => {
      const job = schedule.scheduleJob("* * * * *", async function () {
        try {
          const res = await fetch(
            `https://youtube-notifer.vercel.app/api/updates?channelUrl=${encodeURIComponent(https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w)}`
          );
          const json = await res.json();

          const { link_yt, id_yt, data_last, status } = json;

          const teks = `*[ _YouTube Update_ ]*

*\`Title:\`* ${data_last.title}
*\`link:\`* ${data_last.link}
*pubDate:* ${data_last.pubDate}
`.trim();

          const lastUpdateList = chats.youtubeUpdateList || {};
          const lastUpdate = lastUpdateList[https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w] || [];
          const newUpdate = !lastUpdate.some(
            (oldData) => oldData.title === data_last.title
          );

          if (newUpdate) {
            await conn.sendFile(
              m.chat,
              data_last.thumbnail,
              "thumbnail.jpg",
              teks.trim(),
              null
            );

            // Simpan pembaruan untuk setiap kanal
            lastUpdateList[channelUrl] = [data_last];
            chats.youtubeUpdateList = lastUpdateList;
          }
        } catch (error) {
          conn.reply(
            global.owner.number + "@s.whatsapp.net",
            `Error fetching YouTube data for https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w : ` + error
          );
          console.error(`Error fetching YouTube data for https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w :`, error.message);
        }
      });

      youtubeUpdateJobs.push(job);
    });
  }
  return;
};

module.exports = handler;