const fs = require('fs/promises');

// Fungsi untuk delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handler = async (m, { conn, args }) => {
  try {
    const chatID = m.chat;

    // Memastikan fitur hanya berjalan di grup
    const isGroup = m.isGroup || m.chat.endsWith('@g.us');
    if (!isGroup) throw "❌ Fitur ini hanya dapat digunakan dalam grup.";

    // Memastikan kode negara diberikan
    if (!args[0] || !args[0].startsWith('+')) {
      throw "❌ Harap masukkan kode negara. Contoh: *svkontak4 +62*";
    }
    const countryCode = args[0].slice(1); // Menghapus tanda '+' untuk pemrosesan

    const groupInfo = await conn.groupMetadata(chatID);
    const participants = groupInfo.participants || [];
    const groupName = groupInfo.subject || "Grup";

    if (participants.length === 0) {
      return m.reply("❌ Tidak ada anggota dalam grup.");
    }

    const fileName = './contacts.vcf';
    let existingContacts = new Set();
    const nameCounts = {}; // Penyimpanan untuk angka urut nama

    // Memeriksa apakah file sudah ada
    try {
      const existingData = await fs.readFile(fileName, 'utf-8');
      const matches = existingData.match(/waid=(\d+)/g);
      if (matches) {
        matches.forEach(match => {
          const number = match.replace('waid=', '');
          existingContacts.add(number);
        });
      }
    } catch (err) {
      // Jika file tidak ada, maka tidak ada kontak yang disimpan
    }

    let vcard = '';
    let newContacts = 0;

    // Membuat VCARD untuk peserta baru
    for (let participant of participants) {
      if (participant.id && participant.id.includes('@s.whatsapp.net')) {
        const number = participant.id.split("@")[0];

        // Periksa apakah nomor memiliki kode negara yang sesuai
        if (number.startsWith(countryCode)) {
          if (!existingContacts.has(number)) {
            // Ambil nama dari metadata atau gunakan nomor jika nama tidak tersedia
            let displayName = participant.notify || `+${countryCode}`;

            // Tambahkan angka urut jika nama sudah ada
            nameCounts[displayName] = (nameCounts[displayName] || 0) + 1;
            displayName += ` (${groupName} #${nameCounts[displayName]})`;

            vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD\n`;
            newContacts++;
          }
        }
      }
    }

    if (newContacts === 0) {
      return m.reply(`❌ Tidak ada kontak baru dengan kode negara +${countryCode}.`);
    }

    // Menyimpan kontak baru ke file
    await fs.appendFile(fileName, vcard.trim() + '\n');
    m.reply(`✅ Mengimpor ${newContacts} kontak baru dengan kode negara +${countryCode}...`);

    await sleep(2000); // Delay sebelum mengirim file
    await conn.sendMessage(m.chat, {
      document: await fs.readFile(fileName),
      mimetype: 'text/vcard',
      fileName: 'Contacts.vcf',
      caption: `🔹 *GROUP:* ${groupName}\n🔹 *KODE NEGARA:* +${countryCode}\n🔹 *KONTAK BARU:* ${newContacts}`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(`❌ Terjadi kesalahan: ${err.message || err}`);
  }
};

handler.help = ['svkontak4 <kode_negara>'];
handler.tags = ['tools'];
handler.command = ['svkontak4'];
handler.group = true; // Mengatur agar fitur ini hanya dapat digunakan di grup
handler.owner = true;

module.exports = handler;