//from tanaka sen

const fetch = require('node-fetch');

let handler = async (m, { text }) => {
    if (!text) return m.reply('Masukkan link yang ingin dipendekkan.');
    
    async function vgd(url) {
        try {
            const response = await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
            const result = await response.json();
            return result.shorturl; // Mengembalikan URL pendek
        } catch (error) {
            console.error(error);
            return null; // Mengembalikan null jika terjadi error
        }
    }

    let shortUrl = await vgd(text); // Memanggil fungsi vgd dengan argumen q
    if (shortUrl) {
        m.reply(`URL pendek: ${shortUrl}`); // Mengirimkan URL pendek
    } else {
        m.reply('Terjadi kesalahan saat mempersingkat URL.'); // Pesan jika terjadi kesalahan
    }
}

handler.help = ['vgd <url>'];
handler.tags = ['shorturl'];
handler.command = /^vgd$/i;
handler.limit = false;

module.exports = handler;