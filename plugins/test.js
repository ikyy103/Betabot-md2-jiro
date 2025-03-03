let os = require('os');
let { performance } = require('perf_hooks');

let handler = async (m, { conn }) => {
    // Hitung kecepatan respon bot
    let start = performance.now();
    let end = performance.now();

    // Informasi sistem
    let used = process.memoryUsage();
    let uptime = process.uptime();

    let status = `
📊 *Status Bot*

📌 *Kecepatan Respon:*
   ◦ ${Math.round(end - start)} ms

📌 *Sistem:*
   ◦ Platform: ${os.platform()}
   ◦ CPU: ${os.cpus()[0].model}
   ◦ Memory: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
   ◦ Uptime: ${formatUptime(uptime)}

📌 *Bot Info:*
   ◦ Prefix: ${global.prefix || '.'}
   ◦ Versi: 1.0.0
   ◦ Mode: ${global.opts['self'] ? 'Self-Bot' : 'Public-Bot'}

📌 *Developer:*
   ◦ Nama: Zephyr
   ◦ Kontak: wa.me/${global.numberowner}
`.trim();

    m.reply(status);
};

// Fungsi untuk format uptime
function formatUptime(seconds) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    return `${d} hari, ${h} jam, ${m} menit, ${s} detik`;
}

// Properti handler
handler.command = /^test$/i;
handler.tags = ['info'];
handler.help = ['test'];

module.exports = handler;