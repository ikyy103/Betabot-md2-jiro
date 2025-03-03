const fs = require('fs/promises');

// Fungsi untuk delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handler = async (m, { conn }) => {
  try {
    const chatID = m.chat;

    // Memastikan fitur hanya berjalan di private chat
    const isPrivate = !m.isGroup && !m.chat.endsWith('@g.us');
    if (!isPrivate) throw "❌ Fitur ini hanya dapat digunakan di private chat.";

    const contact = await conn.getName(chatID);
    if (!contact) throw "❌ Tidak dapat mengambil informasi kontak.";

    const participants = [chatID]; // Hanya satu pengguna
    let vcard = '';
    let noPort = 0;
    const nameCounts = {}; // Penyimpanan untuk jumlah nama yang sama

    // Membuat VCARD untuk pengguna
    for (let participant of participants) {
      if (participant.includes('@s.whatsapp.net')) {
        const number = participant.split("@")[0];

        // Ambil nama dari nama di WhatsApp
        const baseName = contact || number; // Jika nama tidak tersedia, gunakan nomor

        // Tambahkan angka urut jika nama sudah ada
        nameCounts[baseName] = (nameCounts[baseName] || 0) + 1;
        const displayName = nameCounts[baseName] > 1
          ? `${baseName} (${nameCounts[baseName]})`
          : baseName;

        vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD\n`;
        noPort++;
      }
    }

    if (noPort === 0) {
      return m.reply("❌ Tidak ada kontak yang valid untuk disimpan.");
    }

    const fileName = './private_contact.vcf';

    // Menulis file VCARD
    await fs.writeFile(fileName, vcard.trim());
    m.reply(`✅ Mengimpor ${noPort} kontak...`);

    await sleep(2000); // Delay sebelum mengirim file
    await conn.sendMessage(m.chat, {
      document: await fs.readFile(fileName),
      mimetype: 'text/vcard',
      fileName: 'Private_Contact.vcf',
      caption: `🔹 *NAMA KONTAK:* ${contact}\n🔹 *TOTAL KONTAK:* ${noPort}`
    }, { quoted: m });

    // Menghapus file setelah dikirim
    await fs.unlink(fileName);
  } catch (err) {
    console.error(err);
    m.reply(`❌ Terjadi kesalahan: ${err.message || err}`);
  }
};

handler.help = ['svctc'];
handler.tags = ['tools'];
handler.command = ['svctc'];
handler.private = true; // Mengatur agar fitur ini hanya dapat digunakan di private chat
handler.owner = true;

module.exports = handler;