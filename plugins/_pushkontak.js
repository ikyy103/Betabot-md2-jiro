let handler = async (m, { conn, groupMetadata, text, command }) => {
    // Memastikan input text atau reply pesan tersedia
    if (!text && !m.quoted) return m.reply("Input text atau reply pesan");

    // Mendapatkan daftar ID peserta grup
    let participants = groupMetadata.participants.map(v => v.id.endsWith('.net') && v.id).filter(v => v);
    let totalContacts = participants.length;

    // Mengecek apakah ada input jumlah kontak
    let args = text.split(' ');
    let messageText = args.slice(1).join(' '); // Pesan yang ingin dikirim
    let maxContacts = parseInt(args[0]); // Jumlah kontak yang ingin diambil

    if (isNaN(maxContacts) || maxContacts <= 0 || maxContacts > totalContacts) {
        maxContacts = totalContacts; // Default: semua kontak
    }

    // Membatasi jumlah kontak
    let selectedContacts = participants.slice(0, maxContacts);
    let sentCount = 0;

    // Mengirimkan pesan
    m.reply(`Mengirim pesan ke ${maxContacts} kontak, tunggu sebentar...`);

    for (let i = 0; i < selectedContacts.length; i++) {
        setTimeout(async () => {
            try {
                if (messageText) {
                    await conn.sendMessage(selectedContacts[i], { text: messageText });
                } else if (m.quoted) {
                    await conn.copyNForward(selectedContacts[i], m.getQuotedObj(), false);
                }
                sentCount++;
            } catch (err) {
                console.error(`Gagal mengirim pesan ke ${selectedContacts[i]}:`, err);
            }

            // Respon akhir setelah semua selesai
            if (sentCount === selectedContacts.length) {
                m.reply(`Berhasil mengirim pesan ke ${sentCount} kontak.`);
            }
        }, i * 2000); // Delay 2 detik per kontak
    }
};

handler.command = handler.help = ['pushkontak'];
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;

module.exports = handler;