let handler = async (m, { conn }) => {
  const qrisImage = 'https://cloudkuimages.com/uploads/images/67f25e4ae348e.jpg';
  const qrisLink = 'https://cloudkuimages.com/uploads/images/67f25e4ae348e.jpg';

  const caption = `
╭───〔 *PEMBAYARAN QRIS* 〕───⬣
│
│ Silakan scan QRIS di bawah untuk membayar
│ atau klik link: ${qrisLink}
│
│ *Metode Pembayaran Tersedia:*
│ • DANA: ${dana}
│ • GoPay: ${gopay}
│ • OVO: ${ovo}
│ • ShopeePay: ${shopee}
│ • Qris all payment: ${qris}
│
│ Setelah pembayaran, kirim bukti
│ pembayaran ke admin.
│
╰────────────⬣
`;

  await conn.sendFile(m.chat, qrisImage, 'qris.jpg', caption, m);
};

handler.help = ['payment'];
handler.tags = ['info'];
handler.command = /^payment$/i;
handler.limit = false;

module.exports = handler;