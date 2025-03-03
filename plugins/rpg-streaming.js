let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender];
    const tag = `@${m.sender.replace(/@.+/, '')}`;
    const platforms = {
        'tt': 'TikTok',
        'ig': 'Instagram',
        'fb': 'Facebook',
        'dc': 'Discord',
    };

    try {
        let platformKey = command.match(/ttlive|iglive|fblive|dclive/)[0].replace('live', '');
        let platform = platforms[platformKey];

        // Validasi akun pengguna
        if (!user[`${platformKey}_account`]) {
            return conn.reply(m.chat, `Hey ${tag},\nBuat akun ${platform} terlebih dahulu\nKetik: .createakun${platformKey}`, m);
        }

        // Validasi dan pengaturan judul
        let title = args.join(' ');
        if (!title || title.length > 50) {
            return conn.reply(m.chat, `${tag}, silakan beri judul live Anda (maksimal 50 karakter).`, m);
        }

        // Validasi cooldown
        const cooldownTime = 600000; // 10 menit cooldown
        const lastLiveTime = user[`lastLiveTime_${platformKey}`] || 0;
        const timeSinceLastLive = new Date() - lastLiveTime;

        if (timeSinceLastLive < cooldownTime) {
            const remainingCooldown = msToTime(cooldownTime - timeSinceLastLive);
            throw `Tunggu selama ${remainingCooldown} sebelum live streaming lagi.`;
        }

        // Simulasi hasil live streaming dengan pengecekan nilai
        const randomFollowers = isNaN(Math.floor(Math.random() * 3000) + 10) ? 0 : Math.floor(Math.random() * 3000) + 10;
        const randomLikes = isNaN(Math.floor(Math.random() * 1000) + 20) ? 0 : Math.floor(Math.random() * 1000) + 20;
        const randomViewers = isNaN(Math.floor(Math.random() * 1000000) + 100) ? 0 : Math.floor(Math.random() * 1000000) + 100;
        const randomDonation = isNaN(Math.floor(Math.random() * 200000) + 10000) ? 0 : Math.floor(Math.random() * 200000) + 10000;

        // Memastikan data pengguna tidak bernilai NaN
        if (!isNumber(user[`${platformKey}_followers`])) user[`${platformKey}_followers`] = 0;
        if (!isNumber(user[`${platformKey}_likes`])) user[`${platformKey}_likes`] = 0;
        if (!isNumber(user[`${platformKey}_viewers`])) user[`${platformKey}_viewers`] = 0;
        if (!isNumber(user.money)) user.money = 0;

        // Menambahkan hasil live ke data pengguna
        user[`${platformKey}_followers`] += randomFollowers;
        user[`${platformKey}_likes`] += randomLikes;
        user[`${platformKey}_viewers`] += randomViewers;
        user.money += randomDonation;
        user[`lastLiveTime_${platformKey}`] = new Date();

        // **Menambahkan jumlah post setiap kali melakukan live streaming**
        user[`${platformKey}_posts`] = (user[`${platformKey}_posts`] || 0) + 1;  // Menambah jumlah post

        // Format hasil
        const formattedFollowers = formatNumber(user[`${platformKey}_followers`]);
        const formattedLikes = formatNumber(user[`${platformKey}_likes`]);
        const formattedViewers = formatNumber(user[`${platformKey}_viewers`]);
        const formattedDonation = formatCurrency(randomDonation);
        const formattedPosts = formatNumber(user[`${platformKey}_posts`] || 0); // Format jumlah post

        conn.reply(m.chat, `
[🎦] *Hasil Live Streaming ${platform}*

🧑🏻‍💻 *Streamer:* ${tag}
📹 *Judul Live:* ${title}
👥 *New Followers:* +${formatNumber(randomFollowers)}
👍🏻 *New Likes:* +${formatNumber(randomLikes)}
🪬 *New Viewers:* +${formatNumber(randomViewers)}
💵 *Donasi:* ${formattedDonation}

📊 *Total Followers:* ${formattedFollowers}
📊 *Total Likes:* ${formattedLikes}
📊 *Total Viewers:* ${formattedViewers}
📄 *Total Posts:* ${formattedPosts} 

> Cek akun ${platform} Anda dengan .akun${platformKey}
        `, m);
    } catch (err) {
        m.reply("📢: " + err);
    }
};

// Fungsi utilitas untuk format angka dan waktu
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'M';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'Jt';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function formatCurrency(num) {
    return 'Rp' + new Intl.NumberFormat('id-ID').format(num);
}

function msToTime(ms) {
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let seconds = Math.floor((ms / 1000) % 60);
    return `${hours} jam ${minutes} menit ${seconds} detik`;
}

// Fungsi untuk mengecek apakah nilai adalah angka yang valid
function isNumber(value) {
    return !isNaN(value) && value !== null && value !== undefined;
}

handler.help = ['ttlive', 'iglive', 'fblive', 'dclive'];
handler.tags = ['rpg'];
handler.command = /^(ttlive|iglive|fblive|dclive)$/i;
handler.register = true;
handler.rpg = true;
handler.group = true;

module.exports = handler;