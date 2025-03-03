const fs = require('fs/promises');

// Fungsi untuk delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handler = async (m, { conn }) => {
  try {
    const chatID = m.chat;

    // Memastikan fitur hanya berjalan di grup
    const isGroup = m.isGroup || m.chat.endsWith('@g.us');
    if (!isGroup) throw "❌ Fitur ini hanya dapat digunakan dalam grup.";

    const groupInfo = await conn.groupMetadata(chatID);
    const participants = groupInfo.participants || [];
    const groupName = groupInfo.subject || "Grup";

    if (participants.length === 0) {
      return m.reply("❌ Tidak ada anggota dalam grup.");
    }

    let vcard = '';
    let noPort = 0;
    const nameCounts = {}; // Penyimpanan untuk jumlah nama yang sama

    // Membuat VCARD untuk semua peserta
    for (let participant of participants) {
      if (participant.id && participant.id.includes('@s.whatsapp.net')) {
        const number = participant.id.split("@")[0];

        // Ambil nama dari nama di WhatsApp
        const contact = await conn.getName(participant.id);
        const baseName = contact || number; // Jika nama tidak tersedia, gunakan nomor

        // Tambahkan angka urut jika nama sudah ada
        nameCounts[baseName] = (nameCounts[baseName] || 0) + 1;
        const displayName = nameCounts[baseName] > 1
          ? `${baseName} (${nameCounts[baseName]})`
          : baseName;

        vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName} (${groupName})\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD\n`;
        noPort++;
      }
    }

    if (noPort === 0) {
      return m.reply("❌ Tidak ada kontak yang valid untuk disimpan.");
    }

    const fileName = './contacts.vcf';

    // Menulis file VCARD
    await fs.writeFile(fileName, vcard.trim());
    m.reply(`✅ Mengimpor ${noPort} kontak...`);

    await sleep(2000); // Delay sebelum mengirim file
    await conn.sendMessage(m.chat, {
      document: await fs.readFile(fileName),
      mimetype: 'text/vcard',
      fileName: `${groupName.replace(/[^a-zA-Z0-9]/g, '_')}_Contacts.vcf`,
      caption: `🔹 *GROUP:* ${groupName}\n🔹 *MEMBER:* ${noPort}`
    }, { quoted: m });

    // Menghapus file setelah dikirim
    await fs.unlink(fileName);
  } catch (err) {
    console.error(err);
    m.reply(`❌ Terjadi kesalahan: ${err.message || err}`);
  }
};

handler.help = ['svkontak0'];
handler.tags = ['tools'];
handler.command = ['svkontak0'];
handler.group = true; // Mengatur agar fitur ini hanya dapat digunakan di grup
handler.owner = true;

module.exports = handler;