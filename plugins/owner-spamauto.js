let spamDetectionEnabled = true; // Fitur ini default aktif
const spamThreshold = 5; // Batas jumlah pesan untuk dianggap spam
const spamInterval = 60 * 1000; // Waktu dalam milidetik (60 detik)
const spamReports = new Map(); // Penyimpan data spam sementara

// Handler utama
let handler = async (m, { conn, command, args }) => {
    if (command === 'spamauto') {
        if (args[0] === 'on') {
            spamDetectionEnabled = true;
            conn.reply(m.chat, '*Deteksi spam otomatis diaktifkan.*', null);
        } else if (args[0] === 'off') {
            spamDetectionEnabled = false;
            conn.reply(m.chat, '*Deteksi spam otomatis dinonaktifkan.*', null);
        } else {
            conn.reply(
                m.chat,
                `Gunakan perintah dengan argumen:\n- *.spamauto on* untuk mengaktifkan\n- *.spamauto off* untuk menonaktifkan`,
                null
            );
        }
        return;
    }

    // Jika deteksi spam aktif
    if (spamDetectionEnabled) {
        detectSpam(m, conn);
    }
};

// Fungsi pendeteksi spam
function detectSpam(m, conn) {
    const now = Date.now();
    const userId = m.sender;

    // Ambil data spam pengguna
    let userSpamData = spamReports.get(userId) || { count: 0, lastMessageTime: 0 };

    // Reset jika interval terlalu lama
    if (now - userSpamData.lastMessageTime > spamInterval) {
        userSpamData.count = 0;
    }

    // Tambahkan hitungan pesan
    userSpamData.count++;
    userSpamData.lastMessageTime = now;

    // Simpan data kembali
    spamReports.set(userId, userSpamData);

    // Jika melebihi threshold
    if (userSpamData.count > spamThreshold) {
        conn.reply(m.chat, `*⚠️ Deteksi Spam!*\nPengguna @${m.sender.split('@')[0]} mengirim terlalu banyak pesan dalam waktu singkat.`, null, {
            mentions: [m.sender],
        });

        // Kirim laporan ke owner
        conn.reply(
            '6281547205987@s.whatsapp.net', // Ganti dengan nomor owner
            `*[LAPORAN SPAM]*\n\nPengguna: @${m.sender.split('@')[0]}\nJumlah pesan: ${userSpamData.count}\nWaktu: ${new Date().toLocaleString()}`,
            null,
            {
                mentions: [m.sender],
            }
        );

        // Reset data spam pengguna
        spamReports.set(userId, { count: 0, lastMessageTime: now });
    }
}

handler.help = ['spamauto on/off'];
handler.tags = ['owner'];
handler.command = /^(spamauto|spamdeteksi)$/i;

handler.owner = true;

module.exports = handler;