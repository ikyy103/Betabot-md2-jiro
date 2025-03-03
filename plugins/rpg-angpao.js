const millisecondsPerMinute = 60 * 1000;
const thumbnailUrl = 'https://telegra.ph/file/86b8216626a3e25a8fc68.jpg'; // URL Thumbnail Angpao

let activeAngpaos = {};

let handler = async (m, { args, conn }) => {
    try {
        let user = global.db.data.users[m.sender];
        if (!user) throw 'Pengguna tidak ada di dalam database.';

        // Validasi input
        if (args.length < 3) throw 'Gunakan format: .angpao <jumlahUser> <totalMoney> <durasi (menit)>';

        let [jumlahUser, totalMoney, durasi] = args.map(Number);

        if (!jumlahUser || !totalMoney || !durasi || jumlahUser <= 0 || totalMoney <= 0 || durasi <= 0) {
            throw 'Semua nilai harus berupa angka positif.';
        }

        // Pastikan user memiliki uang yang cukup
        if (user.money < totalMoney) throw 'Uangmu tidak cukup untuk membuat angpao.';

        // Kurangi uang pembuat angpao
        user.money -= totalMoney;

        // Buat ID angpao unik
        const angpaoId = `angpao-${Date.now()}-${m.sender}`;

        // Simpan data angpao
        activeAngpaos[angpaoId] = {
            creator: m.sender,
            totalMoney,
            jumlahUser,
            durasi: durasi * millisecondsPerMinute,
            claimedUsers: [],
            startTime: Date.now()
        };

        // Broadcast ke semua grup
        for (const jid in global.db.data.chats) {
            const chat = global.db.data.chats[jid];
            if (chat.rpg && chat.active) {
                await conn.sendMessage(jid, {
                    text: `🎉 *Angpao Baru!* 🎉\n\n🎁 Pembuat: @${m.sender.split('@')[0]}\n💰 Total Uang: ${totalMoney.toLocaleString()}\n👥 Jumlah Penerima: ${jumlahUser}\n🕒 Durasi: ${durasi} menit.\n\nBalas pesan ini dan ketik *claim* untuk mengambil angpao!`,
                    mentions: [m.sender],
                    contextInfo: {
                        externalAdReply: {
                            title: "🎁 - A N G P A O",
                            body: '',
                            thumbnailUrl,
                            sourceUrl: global.sgc, // Opsional, bisa diisi URL lain jika ada
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                });
            }
        }

        m.reply(`Angpao berhasil dibuat dan disiarkan ke semua grup aktif!`);

        // Hapus angpao setelah durasi habis
        setTimeout(() => {
            delete activeAngpaos[angpaoId];
            m.reply(`Angpao dengan ID *${angpaoId}* telah berakhir.`);
        }, durasi * millisecondsPerMinute);
    } catch (error) {
        console.error(error);
        m.reply(error.toString());
    }
};

handler.help = ['angpao'];
handler.tags = ['rpg'];
handler.command = /^(angpao)$/i;

module.exports = handler;