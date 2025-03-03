let handler = async (m, { conn, args, command, text }) => {
    if (!text) throw `❌ Silakan masukkan pesan pengingat dan waktu!\n\nContoh:\n*.remind 1d Halo, ini pesan pengingat!*`;
    if (!args[0]) throw `❌ Harap tentukan durasi waktu pengingat!\n\nFormat waktu:\n1m = 1 menit\n1h = 1 jam\n1d = 1 hari\n1y = 1 tahun`;

    let duration = args[0];
    let message = text.slice(duration.length).trim();
    if (!message) throw `❌ Anda belum memasukkan pesan pengingat!`;

    // Validasi durasi
    let timeMultiplier = {
        m: 60000, // Menit ke milidetik
        h: 3600000, // Jam ke milidetik
        d: 86400000, // Hari ke milidetik
        y: 31536000000 // Tahun ke milidetik
    };
    let unit = duration.slice(-1).toLowerCase(); // Ambil satuan waktu
    let time = parseInt(duration.slice(0, -1)); // Ambil nilai angka durasi

    if (!timeMultiplier[unit] || isNaN(time)) throw `❌ Format waktu tidak valid!\n\nGunakan format:\n1m (menit), 1h (jam), 1d (hari), atau 1y (tahun).`;

    let timer = time * timeMultiplier[unit]; // Hitung durasi dalam milidetik

    if (timer < 10000) throw `❌ Durasi waktu terlalu pendek! Minimal 10 detik.`;

    let sendAt = Date.now() + timer; // Waktu pengiriman pesan

    // Kirim konfirmasi pengingat
    m.reply(`✅ Pengingat telah disimpan!\n\nPesan: "${message}"\nAkan dikirim dalam ${time} ${unit} (${new Date(sendAt).toLocaleString('id')})`);

    // Tunggu hingga waktu yang ditentukan, lalu kirim pesan pengingat
    setTimeout(() => {
        conn.reply(m.chat, `⏰ *Pengingat:*\n\n${message}`, m);
    }, timer);
};

handler.command = /^(remind|pengingat|ingatkan)$/i;
handler.tags = ['tools'];
handler.help = ['remind <waktu> <pesan>'];
handler.group = false; // Bisa digunakan di mana saja
handler.private = false; // Bisa digunakan di grup atau private chat

module.exports = handler;