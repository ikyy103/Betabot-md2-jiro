const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const apiUrl = 'https://okeconnect.com/harga/json?id=905ccd028329b0a';
        const response = await axios.get(apiUrl);

        if (!response.data || response.data.length === 0) {
            throw '❌ Gagal mengambil daftar produk. Coba lagi nanti.';
        }

        let products = response.data;
        let searchQuery = args.join(' ').toLowerCase();

        if (searchQuery) {
            products = products.filter(p => p.produk.toLowerCase().includes(searchQuery));
            if (products.length === 0) return conn.reply(m.chat, `⚠️ Produk dengan nama "${searchQuery}" tidak ditemukan.`, m);
        }

        let text = `📌 *Daftar Produk DrakHole Topup*\n\n`;
        for (let product of products) {
            let hargaAsli = parseInt(product.harga);
            let hargaJual = hargaAsli + 100; // Tambahan keuntungan Rp100
            text += `➣ 『 ${product.produk} 』\n`;
            text += `🆔 Kode: *${product.kode}*\n`;
            text += `💰 Harga: *Rp${hargaJual.toLocaleString()}*\n`;
            text += `📌 Kategori: *${product.kategori}*\n`;
            text += `ℹ️ Keterangan: *${product.keterangan}*\n\n`;
        }

        conn.reply(m.chat, text, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '⚠️ Terjadi kesalahan dalam mengambil data produk.', m);
    }
};

handler.help = ['produk', 'produk <nama>'];
handler.tags = ['store'];
handler.command = /^(produk)$/i;
handler.register = true;

module.exports = handler;