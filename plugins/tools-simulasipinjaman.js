let handler = async (m, { text }) => {
    let [loan, rate, duration] = text.split(' ');
    if (!loan || !rate || !duration) throw `Gunakan format: .simulasipinjaman [jumlah pinjaman] [bunga %] [jangka waktu bulan]`;

    loan = parseFloat(loan);
    rate = parseFloat(rate) / 100;
    duration = parseInt(duration);

    let monthlyPayment = (loan * rate / 12) / (1 - Math.pow(1 + rate / 12, -duration));
    let totalPayment = monthlyPayment * duration;

    m.reply(`Pinjaman ${loan} dengan bunga ${rate * 100}% selama ${duration} bulan:\nCicilan per bulan: ${monthlyPayment.toFixed(2)}\nTotal pembayaran: ${totalPayment.toFixed(2)}`);
};

handler.help = ['simulasipinjaman [jumlah] [bunga] [bulan]'];
handler.tags = ['tools'];
handler.command = /^simulasipinjaman$/i;

module.exports = handler;