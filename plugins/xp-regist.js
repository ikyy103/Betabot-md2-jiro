const { createHash } = require('crypto');
const moment = require('moment-timezone');

let handler = async function (m, { conn, text, usedPrefix }) {
    let user = global.db.data.users[m.sender];

    if (user.registered === true) {
        throw `❌ Anda sudah terdaftar!\nGunakan *${usedPrefix}unreg <SN>* untuk daftar ulang.`;
    }

    if (!text) {
        throw `❌ Format salah!\nGunakan: *${usedPrefix}daftar nama.tahunLahir.gender.bio*`;
    }

    let input = text.split('.');

    if (input.length < 4) {
        throw `⚠️ Format tidak lengkap!\nGunakan: *${usedPrefix}daftar nama.tahunLahir.gender.bio*`;
    }

    let [name, tahunLahir, gender, ...bioArray] = input;
    let bio = bioArray.join('.').trim(); // Menangani bio yang mengandung titik

    if (!name) throw '⚠️ Nama tidak boleh kosong!';
    if (!tahunLahir || isNaN(tahunLahir)) throw '⚠️ Tahun lahir harus berupa angka!';
    if (!gender) throw '⚠️ Gender tidak boleh kosong! Pilih: Pria/Wanita.';
    if (!bio) throw '⚠️ Bio tidak boleh kosong!';
    if (bio.length > 100) throw '⚠️ Bio terlalu panjang! Maksimal 100 karakter.';

    tahunLahir = parseInt(tahunLahir);
    let currentYear = new Date().getFullYear();
    let umur = currentYear - tahunLahir;

    if (umur > 120) throw '🚫 Umur terlalu tua untuk mendaftar!';
    if (umur < 5) throw '🚫 Bayi tidak bisa mendaftar!';
    if (tahunLahir > currentYear || tahunLahir < 1900) {
        throw `🚫 Tahun lahir tidak valid! Harus antara 1900-${currentYear}`;
    }

    user.name = name.trim();
    user.age = umur;
    user.gender = gender.trim();
    user.bio = bio;
    user.tahunLahir = tahunLahir;
    user.regTime = +new Date;
    user.registered = true;

    user.money = 100000; // Reward money
    user.exp = 5999; // Reward exp
    user.limit = 10; // Reward limit (Gantinya apel)

    let sn = createHash('md5').update(m.sender).digest('hex');

    let caption = `
┏─• *ᴜꜱᴇʀꜱ* 
│▸ *ɴᴀᴍᴀ:* ${name}
│▸ *ᴜᴍᴜʀ:* ${umur} ᴛᴀʜᴜɴ
│▸ *ɢᴇɴᴅᴇʀ:* ${gender}
│▸ *ʙɪᴏ:* ${bio}
│▸ *ꜱᴇʀɪᴀʟ ɴᴜᴍʙᴇʀ:* ${sn}
│▸ *ʀᴇᴡᴀʀᴅ ᴍᴏɴᴇʏ:* ${user.money}
│▸ *ʀᴇᴡᴀʀᴅ ᴇxᴘ:* ${user.exp}
│▸ *ʀᴇᴡᴀʀᴅ ʟɪᴍɪᴛ:* ${user.limit}
┗────···

ᴘᴇɴᴅᴀꜰᴛᴀʀᴀɴ ꜱᴇʟᴇꜱᴀɪ!
> silahkan ketik  .allmenu untuk melihat seluruh menu yang ada di bot. 
`.trim();

    // Kirim notifikasi ke grup admin
    const adminGroupId = '120363347063028657@g.us'; // Ganti dengan ID grup admin
    const regTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const adminMessage = `
📢 *𝙽𝚘𝚝𝚒𝚏𝚒𝚔𝚊𝚜𝚒 𝚞𝚜𝚎𝚛 𝚋𝚊𝚛𝚞* 📢

📛 *𝙽𝚊𝚖𝚊:* ${name}
🚻 *𝙶𝚎𝚗𝚍𝚎𝚛:* ${gender}
📜 *𝙱𝙸𝙾:* ${bio}
⏰ *𝚆𝚊𝚔𝚝𝚞 𝙳𝚊𝚏𝚝𝚊𝚛:* ${regTime}

> 𝚖𝚘𝚑𝚘𝚗 𝚋𝚊𝚗𝚝𝚞𝚊𝚗 𝚗𝚢𝚊 𝚞𝚗𝚝𝚞𝚔 𝚞𝚜𝚎𝚛 𝚋𝚊𝚛𝚞, 𝚍𝚒 𝚋𝚊𝚗𝚝𝚞 𝚞𝚗𝚝𝚞𝚔 𝚖𝚎𝚗𝚐𝚐𝚞𝚗𝚊𝚔𝚊𝚗 𝚏𝚒𝚝𝚞𝚛 𝚍𝚒 𝚋𝚘𝚝 𝚉𝚎𝚙𝚑𝚢𝚛 𝚒𝚗𝚒.`;

    await conn.sendMessage(adminGroupId, { text: adminMessage });

    let imageUrl = 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/j8qz0zz6.mp4';
    conn.sendFile(m.chat, imageUrl, null, caption, m);
};

handler.help = ['daftar', 'reg', 'register'].map(v => v + ' <nama>.<tahunLahir>.<gender>.<bio>');
handler.tags = ['xp'];
handler.command = /^(daftar|reg(ister)?)$/i;

module.exports = handler;