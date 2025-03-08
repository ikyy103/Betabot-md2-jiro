let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];

    const huntCost = 5000;
    if (user.money < huntCost) return m.reply(`Uang kamu tidak cukup untuk memulai pencarian ini. Kamu butuh ${huntCost} money.`);

    user.money -= huntCost;
    const outcomes = [
        { type: 'exp', value: Math.floor(Math.random() * (2000 - 500 + 1)) + 500, desc: 'Memberikan nasihat yang baik!' },
        { type: 'money', value: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000, desc: 'Membantu dengan donasi uang!' },
        { type: 'limit', value: Math.floor(Math.random() * 5) + 1, desc: 'Menyediakan sumber daya mental yang mendukung.' },
        { type: 'social', value: Math.floor(Math.random() * (50 - 10 + 1)) + 10, desc: 'Meningkatkan reputasi sosialmu!' },
        { type: 'fail', value: 0, desc: 'Usahamu gagal, coba lagi lain kali!' }
    ];

    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    let responseMessage = `🧠 **Pemburu Orang Gila** 🧠\n\n`;
    responseMessage += `🔍 Kamu menemukan seseorang yang membutuhkan bantuan...\n`;
    responseMessage += `📋 ${result.desc}\n\n`;

    if (result.type !== 'fail') {
        user[result.type] = (user[result.type] || 0) + result.value;
        responseMessage += `🎉 Hadiah: +${result.value} ${result.type.toUpperCase()}\n`;
    } else {
        responseMessage += `😢 Kamu tidak berhasil membantu kali ini.\n`;
    }

    responseMessage += `\n💰 Saldo saat ini: ${user.money}`;
    m.reply(responseMessage);
};

handler.command = /^(pemburuoranggila|mentalhunt)$/i;
handler.tags = ['rpg'];
handler.help = ['pemburuoranggila'];
handler.premium = false;

module.exports = handler;