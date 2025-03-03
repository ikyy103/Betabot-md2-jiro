let { sticker5 } = require('../lib/sticker.js');
let axios = require('axios');

let handler = async (m, { conn, args }) => {
    // Daftar warna
    const colorList = [
        { number: 1, name: 'Merah', code: '#FF0000' },
        { number: 2, name: 'Hijau', code: '#008000' },
        { number: 3, name: 'Biru', code: '#0000FF' },
        { number: 4, name: 'Kuning', code: '#FFFF00' },
        { number: 5, name: 'Hitam', code: '#000000' },
        { number: 6, name: 'Putih', code: '#FFFFFF' },
        { number: 7, name: 'Abu-abu', code: '#808080' },
        { number: 8, name: 'Cokelat', code: '#A52A2A' },
        { number: 9, name: 'Oranye', code: '#FFA500' },
        { number: 10, name: 'Ungu', code: '#800080' },
        { number: 11, name: 'Pink', code: '#FFC0CB' },
        { number: 12, name: 'Cyan', code: '#00FFFF' },
        { number: 13, name: 'Magenta', code: '#FF00FF' },
        { number: 14, name: 'Emas', code: '#FFD700' },
        { number: 15, name: 'Perak', code: '#C0C0C0' },
        { number: 16, name: 'Lavender', code: '#E6E6FA' },
        { number: 17, name: 'Turquoise', code: '#40E0D0' },
        { number: 18, name: 'Maroon', code: '#800000' },
        { number: 19, name: 'Navy', code: '#000080' },
        { number: 20, name: 'Olive', code: '#808000' },
    ];

    // Jika tidak ada argumen atau salah input
    if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > colorList.length) {
        let colorText = colorList
            .map(color => `${color.number}. ${color.name}`)
            .join('\n');

        return m.reply(
            `*Daftar Warna yang Tersedia:*\n\n${colorText}\n\n` +
            `*Cara Menggunakan:*\n` +
            `Ketik perintah dengan nomor warna dan teks yang diinginkan. Contoh:\n` +
            `!qc 1 Ini adalah teks (Menggunakan warna Merah)\n` +
            `!qc 2 Ini teks lainnya (Menggunakan warna Hijau)`
        );
    }

    // Pilih warna berdasarkan nomor
    let colorChoice = parseInt(args[0]);
    let selectedColor = colorList[colorChoice - 1].code;

    // Ambil teks
    let text;
    if (args.length > 1) {
        text = args.slice(1).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw "Input teks atau reply teks yang ingin dijadikan quote!";
    }

    if (!text) return m.reply('Masukkan teks!');
    if (text.length > 100) return m.reply('Maksimal 100 karakter!');

    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": selectedColor,
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": m.name,
                "photo": {
                    "url": pp
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    };

    const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const buffer = Buffer.from(json.data.result.image, 'base64');
    let stiker = await sticker5(buffer, false, global.packname, global.author);
    if (stiker) {
        return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);
    }
};

handler.help = ['qccustom <warna> <teks>'];
handler.tags = ['sticker'];
handler.command = /^(qccustom|quotelycustom)$/i;

module.exports = handler;