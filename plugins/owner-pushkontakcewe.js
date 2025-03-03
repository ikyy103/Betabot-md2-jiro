let handler = async (m, { conn, groupMetadata, text, command }) => {
    if (!text && !m.quoted) return m.reply("Input text atau reply pesan");

    let participants = groupMetadata.participants;
    let filteredContacts = participants.filter(v => {
        if (v.id.endsWith('.net') && v.notify) { // v.notify berisi nama pengguna WhatsApp
            // Periksa nama apakah sesuai pola perempuan
            const femalePattern = /(a|i|ni|ti|ly|mi|suci|dinda|sari|putri|ana)$/i;
            const name = v.notify.toLowerCase(); // Mengubah nama ke huruf kecil
            return femalePattern.test(name);
        }
        return false;
    }).map(v => v.id);

    // Jika tidak ada yang cocok
    if (!filteredContacts.length) return m.reply("Tidak ada nama yang cocok dengan pola perempuan.");

    let count = filteredContacts.length;
    let sentCount = 0;
    m.reply("Mengirim pesan, tunggu sebentar...");

    for (let i = 0; i < filteredContacts.length; i++) {
        setTimeout(async function() {
            try {
                if (text) {
                    await conn.sendMessage(filteredContacts[i], { text });
                } else if (m.quoted) {
                    await conn.copyNForward(filteredContacts[i], m.getQuotedObj(), false);
                } else if (text && m.quoted) {
                    await conn.sendMessage(filteredContacts[i], { text: text + "\n" + m.quoted.text });
                }
                sentCount++;
            } catch (err) {
                console.error(`Gagal mengirim pesan ke ${filteredContacts[i]}:`, err);
            }
            count--;
            if (count === 0) {
                m.reply(`Berhasil Push Kontak:\nJumlah Pesan Terkirim: *${sentCount}*`);
            }
        }, i * 1000); // delay setiap pengiriman selama 1 detik
    }
};

handler.command = handler.help = ['pushkontakcewe'];
handler.tags = ['owner'];
handler.owner = false;
handler.group = true;

module.exports = handler;