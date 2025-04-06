let handler = async (m, { conn }) => {
  let caption = `
╭───「 *Pembayaran QRIS* 」
│ 
│ Silakan scan QRIS berikut
│ untuk melakukan pembayaran.
│ 
│ Setelah membayar, kirim bukti
│ pembayaran ke admin.
│ 
╰──────
`;

  await conn.sendFile(m.chat, 'https://cloudkuimages.com/uploads/images/67f25e4ae348e.jpg', 'qris.jpg', caption, m);
};

handler.help = ['paymentqris', 'qris'];
handler.tags = ['info'];
handler.command = /^paymentqris|qris$/i;
handler.limit = false;

module.exports = handler;