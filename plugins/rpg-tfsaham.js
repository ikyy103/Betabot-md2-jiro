let handler = async (m, { conn, args }) => {
    if (args.length < 3) {
        return conn.reply(m.chat, `Gunakan format .tf <nomor_saham> <jumlah> <@tag>\n📍 Contoh penggunaan: *.tf 1 10 @tag*\n\n*List saham yang bisa ditransfer:*`, m);
    } else try {
        const nomorSaham = args[0];
        const jumlah = parseInt(args[1]);
        const saham = convertToStockSymbol(nomorSaham);
        const who = m.mentionedJid ? m.mentionedJid[0] : null;

        if (!saham || !who) throw 'Tag salah satu, atau ketik Nomernya!!';

        const userStocks = db.stocks[m.sender] || {};
        const recipientStocks = db.stocks[who] || {};

        if (!userStocks[saham] || userStocks[saham] < jumlah) {
            return conn.reply(m.chat, `Anda tidak memiliki cukup saham ${saham} untuk ditransfer.`, m);
        }

        userStocks[saham] -= jumlah;
        recipientStocks[saham] = (recipientStocks[saham] || 0) + jumlah;

        if (userStocks[saham] === 0) {
            delete userStocks[saham];
        }

        db.stocks[m.sender] = userStocks;
        db.stocks[who] = recipientStocks;
        saveDatabase();

        await sendThumbnail(m, conn, `${user.name} berhasil mentransfer ${jumlah} saham ${saham} ke ${who}.`, "https://files.catbox.moe/e93sdt.jpg");
    } catch (e) {
        conn.reply(m.chat, `Terjadi kesalahan: ${e}`, m);
        console.log(e);
    }
};

handler.help = ['tfsaham <nomor_saham> <jumlah> <@tag>'];
handler.tags = ['rpg'];
handler.command = /^(tfsaham)$/i;

module.exports = handler;