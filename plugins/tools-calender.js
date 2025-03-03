const fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    let month = args[0] || new Date().getMonth() + 1;
    let year = args[1] || new Date().getFullYear();

    const apiUrl = `https://fastrestapis.fasturl.cloud/maker/calendar/advanced?month=${month}&year=${year}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        let buffer = await response.buffer();

        await conn.sendFile(m.chat, buffer, 'calendar.jpg', `📅 Kalender untuk bulan ${month} tahun ${year}`, m);
    } catch (error) {
        console.error('Error fetching calendar:', error);
        m.reply('❌ *Terjadi kesalahan saat mengambil gambar kalender!*');
    }
};

handler.help = ['calender <bulan> <tahun>'];
handler.tags = ['tools'];
handler.command = /^calender$/i;

module.exports = handler;