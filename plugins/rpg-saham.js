const fs = require('fs');

// Database untuk menyimpan data secara permanen
const dbFilePath = './stocks.json';
let db = {
    stocks: {},
    stockPrices: {},
    lastMonitorTime: {},
};

// Membaca data dari file JSON
if (fs.existsSync(dbFilePath)) {
    db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

// Menyimpan data ke file JSON
const saveDatabase = () => {
    fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
};

// Daftar saham yang tersedia
const availableStocks = [
    "BitCoin",
    "ElaCoin",
    "KirCoin",
    "RulCoin",
    "RenCoin",
    "FCoin",
    "MCoin",
    "ZerCoin",
    "BBCoin",
    "StCoin",
];

// Menginisialisasi data saham pengguna
const initializeUserStocks = (userId) => {
    if (!db.stocks[userId]) {
        db.stocks[userId] = {};
    }
};

// Memformat angka ke format rupiah
const formatRupiah = (angka) => {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Menghasilkan harga saham acak
const generateRandomStockPrice = () => {
    return Math.floor(Math.random() * (100000000000 - 10000 + 1)) + 10000;
};

// Memperbarui harga saham setiap 30 detik
const updateStockPrices = () => {
    availableStocks.forEach(stock => {
        db.stockPrices[stock] = generateRandomStockPrice();
    });
    saveDatabase();
};

// Memperbarui harga saham secara periodik
setInterval(updateStockPrices, 30000);

let handler = async (m, { conn, command, args }) => {
    const cmd = command.toLowerCase();
    initializeUserStocks(m.sender);

    switch (cmd) {
        case 'bs':
            await beliSaham(m, conn, args);
            break;
        case 'js':
            await jualSaham(m, conn, args);
            break;
        case 'chs':
            await cekHargaSaham(m, conn, args);
            break;
        case 'cs':
            await cekSaham(m, conn);
            break;
        case 'ms':
            await monitorSaham(m, conn, args);
            break;
        case 'ds':
            await daftarSaham(m, conn);
            break;
        case 'saham':
            await tampilkanSaham(m, conn);
            break;
        default:
            conn.reply(m.chat, "Perintah tidak dikenali! Gunakan: bs, js, chs, cs, ms, atau ds.", m);
    }
};

// Daftar saham
const daftarSaham = async (m, conn) => {
    let response = "Daftar saham yang tersedia:\n";
    availableStocks.forEach((stock, index) => {
        response += `${index + 1}. ${stock}\n`;
    });
    await sendThumbnail(m, conn, response, "https://files.catbox.moe/e93sdt.jpg");
};

// Tampilkan panduan saham
const tampilkanSaham = async (m, conn) => {
    let response = "Berikut adalah perintah yang tersedia:\n";
    response += "- bs <nomor_saham> <jumlah>: Membeli saham.\n";
    response += "- js <nomor_saham> <jumlah>: Menjual saham.\n";
    response += "- chs <nomor_saham>: Cek harga saham.\n";
    response += "- cs: Cek saham Anda.\n";
    response += "- ms <nomor_saham>: Pantau harga saham.\n";
    response += "- ds: Lihat daftar saham.\n";
    await sendThumbnail(m, conn, response, "https://files.catbox.moe/e93sdt.jpg");
};

// Mengonversi nomor saham ke simbol saham
const convertToStockSymbol = (number) => {
    const index = parseInt(number) - 1;
    return availableStocks[index] || null;
};

// Cek saham yang dimiliki oleh user
const cekSaham = async (m, conn) => {
    const user = global.db.data.users[m.sender];
    let response = "Daftar saham Anda:\n";
    
    let totalSaham = 0;
    for (let stock in db.stocks[m.sender]) {
        let jumlahSaham = db.stocks[m.sender][stock];
        response += `${stock}: ${jumlahSaham} saham\n`;
        totalSaham += jumlahSaham;
    }

    if (totalSaham === 0) {
        response = "Anda belum memiliki saham.";
    }

    await sendThumbnail(m, conn, response, "https://files.catbox.moe/e93sdt.jpg");
};

// Cek harga saham
const cekHargaSaham = async (m, conn, args) => {
    const saham = convertToStockSymbol(args[0]);

    if (!saham) {
        return conn.reply(m.chat, `Nomor saham tidak valid. Gunakan perintah 'ds' untuk daftar saham.`, m);
    }

    const harga = db.stockPrices[saham] || generateRandomStockPrice();
    await sendThumbnail(m, conn, `Harga saham ${saham}: ${formatRupiah(harga)}`, "https://files.catbox.moe/e93sdt.jpg");
};

// Pantau harga saham
const monitorSaham = async (m, conn, args) => {
    const saham = convertToStockSymbol(args[0]);

    if (!saham) {
        return conn.reply(m.chat, `Nomor saham tidak valid. Gunakan perintah 'ds' untuk daftar saham.`, m);
    }

    const harga = db.stockPrices[saham] || generateRandomStockPrice();
    const lastMonitorTime = db.lastMonitorTime[m.sender] || 0;

    if (Date.now() - lastMonitorTime < 60000) {
        return conn.reply(m.chat, `Anda hanya bisa memantau saham setiap 60 detik. Silakan coba lagi nanti.`, m);
    }

    db.lastMonitorTime[m.sender] = Date.now();
    saveDatabase();

    await sendThumbnail(m, conn, `Memantau harga saham ${saham}: ${formatRupiah(harga)}`, "https://files.catbox.moe/e93sdt.jpg");
};

// Fungsi beli saham
const beliSaham = async (m, conn, args) => {
    const user = global.db.data.users[m.sender];
    const nomorSaham = args[0];
    const saham = convertToStockSymbol(nomorSaham);

    if (!saham) {
        return conn.reply(m.chat, `Nomor saham tidak valid. Gunakan perintah 'ds' untuk daftar saham.`, m);
    }

    const jumlah = parseInt(args[1]);
    if (isNaN(jumlah) || jumlah <= 0) {
        return conn.reply(m.chat, "Format salah! Gunakan: bs <nomor_saham> <jumlah>", m);
    }

    const harga = db.stockPrices[saham] || generateRandomStockPrice();
    const totalBiaya = harga * jumlah;

    if (user.money < totalBiaya) {
        return conn.reply(m.chat, `Uang tidak cukup untuk membeli saham ini.`, m);
    }

    db.stocks[m.sender][saham] = (db.stocks[m.sender][saham] || 0) + jumlah;
    user.money -= totalBiaya;
    saveDatabase();

    await sendThumbnail(m, conn, `${user.name} membeli ${jumlah} saham ${saham} dengan total biaya ${formatRupiah(totalBiaya)}.`, "https://files.catbox.moe/e93sdt.jpg");
};

// Fungsi untuk menjual saham
const jualSaham = async (m, conn, args) => {
    const user = global.db.data.users[m.sender];
    const nomorSaham = args[0];
    const saham = convertToStockSymbol(nomorSaham);

    if (!saham) {
        return conn.reply(m.chat, `Nomor saham tidak valid. Gunakan perintah 'ds' untuk daftar saham.`, m);
    }

    const jumlah = parseInt(args[1]);
    if (isNaN(jumlah) || jumlah <= 0) {
        return conn.reply(m.chat, "Format salah! Gunakan: js <nomor_saham> <jumlah>", m);
    }

    if (!db.stocks[m.sender][saham] || db.stocks[m.sender][saham] < jumlah) {
        return conn.reply(m.chat, `Anda tidak memiliki cukup saham ${saham} untuk dijual.`, m);
    }

    const harga = db.stockPrices[saham] || generateRandomStockPrice();
    const totalPendapatan = harga * jumlah;

    db.stocks[m.sender][saham] -= jumlah;
    if (db.stocks[m.sender][saham] === 0) {
        delete db.stocks[m.sender][saham];
    }
    user.money += totalPendapatan;
    saveDatabase();

    await sendThumbnail(
        m,
        conn,
        `${user.name} berhasil menjual ${jumlah} saham ${saham} dan mendapatkan ${formatRupiah(totalPendapatan)}.`,
        "https://files.catbox.moe/e93sdt.jpg"
    );
};

// Fungsi kirim thumbnail
const sendThumbnail = async (m, conn, text, thumbnailUrl) => {
    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "Fitur Saham",
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl,
                    sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
                },
            },
        },
    }, {});
};

handler.help = handler.command = ["bs", "js", "chs", "cs", "ms", "ds", "saham"];
handler.tags = ["rpg"];
handler.rpg = true;
module.exports = handler;