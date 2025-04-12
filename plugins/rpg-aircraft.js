const handler = async (m, { conn, args }) => {
    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
        'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
        'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
        'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile', 'China',
        'Colombia', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
        'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Fiji',
        'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea',
        'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
        'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan',
        'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Madagascar',
        'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova',
        'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal',
        'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
        'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
        'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
        'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea',
        'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
        'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda',
        'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
        'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    const rewards = ['legendary', 'common', 'mythic', 'uncommon', 'pet', 'iron', 'gold'];
    const destination = args[0];

    if (!destination || !countries.includes(destination)) {
        return conn.reply(m.chat, `✈️ Pilih tujuan negara dari daftar berikut:\n\n${countries.map(n => '• ' + n).join('\n')}`, m);
    }

    const user = global.db.data.users[m.sender];
    const previousCity = user.currentCity || countries[Math.floor(Math.random() * countries.length)];
    const lastPlayed = user.lastFlight || 0;
    const cooldown = 6 * 60 * 60 * 1000;

    if (Date.now() - lastPlayed < cooldown) {
        const remainingTime = cooldown - (Date.now() - lastPlayed);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        return conn.reply(m.chat, `⏳ Tunggu *${hours} jam ${minutes} menit* lagi untuk bermain lagi.`, m);
    }

    // Fungsi generate deskripsi dan gambar lokal (tanpa scrape.js)
    const distanceInfo = (from, to) => {
        return {
            img: { url: `https://i.supa.codes/n-U7J0` },
            desc: `Perjalanan dari ${from} ke ${to} memakan waktu lama namun penuh pengalaman menarik.`
        };
    };

    const { img, desc } = distanceInfo(previousCity, destination);

    await conn.sendMessage(m.chat, {
        image: img,
        caption: `*[ Penerbangan menuju ${destination} ]*\n\n> *Deskripsi:* ${desc}`
    }, { quoted: m });

    await conn.delay(4000);

    // Update user data
    user.lastFlight = Date.now();
    user.currentCity = destination;
    user.flightCount = (user.flightCount || 0) + 1;
    const playCount = user.flightCount;

    const rewardType = rewards[Math.floor(Math.random() * rewards.length)];
    const rewardExp = (Math.floor(Math.random() * 100) + 20) * playCount;
    const rewardMoney = (Math.floor(Math.random() * 1000) + 100) * playCount;

    let rewardAmount = 1;
    switch (rewardType) {
        case 'legendary': rewardAmount = Math.floor(Math.random() * 4) + 1; break;
        case 'mythic': rewardAmount = Math.floor(Math.random() * 3) + 1; break;
        case 'common':
        case 'uncommon': rewardAmount = Math.floor(Math.random() * 10) + 1; break;
        case 'pet': rewardAmount = 1; break;
        case 'iron':
        case 'gold': rewardAmount = Math.floor(Math.random() * 30) + 10; break;
    }

    user.money = (user.money || 0) + rewardMoney;
    user.exp = (user.exp || 0) + rewardExp;
    user[rewardType] = (user[rewardType] || 0) + rewardAmount;

    return conn.sendMessage(m.chat, {
        image: img,
        caption: `✈️ *Penerbangan selesai!*\nDari: *${previousCity}*\nTujuan: *${destination}*\n\n🎁 Hadiah:\n- ${rewardAmount} *${rewardType}*\n- ${rewardExp} *exp*\n- ${rewardMoney} *money*`
    }, { quoted: m });
};

handler.command = ['aircraft'];
handler.help = ['aircraft [negara]'];
handler.tags = ['rpg'];
handler.group = true;

module.exports = handler;