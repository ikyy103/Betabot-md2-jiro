const { scheduleMessage } = require('./bot');

// Handler untuk menerima input dan mengatur pengiriman pesan terjadwal
let handler = async (m, { text }) => {
    // Format input: nomor tujuan tanggal bulan tahun jam menit pesan
    let [nomorTujuan, tanggal, bulan, tahun, jam, menit, ...messageArray] = text.split(' ');

    messageArray = messageArray.join(' ') || 'Pesan Anda';

    // Menyusun nomor WhatsApp
    let contact = `${nomorTujuan}@c.us`;

    // Membuat tanggal dan waktu pengiriman
    let now = new Date();
    let sendDate = new Date(`${tahun}-${bulan}-${tanggal} ${jam}:${menit}`);

    // Validasi input tanggal dan waktu
    if (isNaN(sendDate.getTime())) {
        return m.reply('Format tanggal dan waktu salah. Gunakan format: nomor tujuan tanggal bulan tahun jam menit pesan. Contoh: 081234567890 10 11 2024 14 30 Halo!');
    }

    let difference = sendDate - now;
    if (difference <= 0) {
        return m.reply('Waktu yang dimasukkan sudah berlalu.');
    }

    // Jadwalkan pengiriman pesan
    scheduleMessage(contact, messageArray, sendDate);
    m.reply(`Pesan Anda dijadwalkan untuk dikirim ke ${nomorTujuan} pada ${sendDate.toLocaleString()}.`);
};

// Perintah yang digunakan untuk menjalankan fitur
handler.help = ['schedule <nomorTujuan> <tanggal> <bulan> <tahun> <jam> <menit> <pesan>'];
handler.tags = ['tools'];
handler.command = /^schedule$/i;

module.exports = handler;