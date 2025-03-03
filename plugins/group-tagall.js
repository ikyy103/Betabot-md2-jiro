let handler = async (m, { conn, text, participants }) => {
  // Membuat teks utama
  let teks = `⋙ *PESAN DARI ADMIN GRUP* ⋘\n\n`;
  teks += text ? `Ini adalah pesan dari admin: *${text}*\n\n` : "*Tidak ada pesan tambahan.*\n\n";

  // Menambahkan mention untuk setiap anggota grup
  for (let member of participants) {
    teks += `• @${member.id.split('@')[0]}\n`;
  }

  // Tambahkan footer pesan
  teks += `\n___________________________________________\n`;

  // Menambahkan README di bawah pesan admin
  teks += `*README:*\n`;
  teks += `1. Harap patuhi peraturan grup.\n`;
  teks += `2. Jangan spam atau mengirim konten tidak pantas.\n`;
  teks += `3. Hubungi admin jika ada pertanyaan.\n`;
  teks += `4. Aktifkan notifikasi grup agar tidak ketinggalan informasi penting.\n`;

  // Mengirim pesan ke grup dengan mentions
  conn.sendMessage(m.chat, { 
    text: teks, 
    mentions: participants.map((member) => member.id) 
  });
};

handler.help = ['tagall <pesan>'];
handler.tags = ['group'];
handler.command = /^(tagall|everyone)$/i;

handler.group = true; // Hanya untuk grup
handler.admin = true; // Hanya admin grup yang dapat menggunakan

module.exports = handler;