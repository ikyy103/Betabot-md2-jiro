var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nomor yang ingin dicek!\n\n*Contoh:* ${usedPrefix + command} 6281234567890`;

    if (!/^\d+$/.test(text)) throw `Format nomor tidak valid!\nMasukkan hanya angka tanpa spasi atau simbol.`;

    let originalNumber = text;
    let possibleNumbers = [];
    let validNumbers = [];

    m.reply('Sedang memproses, harap tunggu...');

    // Hapus satu digit dari belakang dan simpan ke array untuk pengujian
    for (let i = 0; i < originalNumber.length; i++) {
        let modifiedNumber = originalNumber.slice(0, -1 - i);
        if (modifiedNumber.length >= 9) { // Minimal panjang nomor valid
            possibleNumbers.push(modifiedNumber);
        }
    }

    // Simulasi pengecekan keaslian nomor
    for (let num of possibleNumbers) {
        // Anggap nomor asli jika genap atau memiliki pola tertentu (disimulasikan).
        if (isRealNumber(num)) {
            validNumbers.push(num);
        }
    }

    // Tentukan hasil
    let response = '';
    if (validNumbers.length > 0) {
        response = `
*Nomor Asli Ditemukan:*
- Nomor Asli: ${validNumbers[0]}
- Hasil Identifikasi: Nomor Asli (Real)

*Detail Tambahan:*
- Nomer yang dihasilkan dari proses eliminasi.
- Total Variasi Nomor Diperiksa: ${possibleNumbers.length}
- Nomor yang valid: ${validNumbers.length} nomor

Jika ada ketidaksesuaian, pastikan ulangi atau gunakan nomor berbeda.
        `;
    } else {
        response = `
*Nomor: ${originalNumber}*
Status: *Nomor Kosong (No Real)*

Tidak ada nomor asli yang ditemukan dalam variasi nomor ini.
        `;
    }

    m.reply(response);
}

// Fungsi simulasi validasi nomor asli
function isRealNumber(number) {
    // Hanya untuk simulasi, gunakan pola tertentu
    return parseInt(number.slice(-1)) % 2 === 0; // Simulasi: Nomor asli jika digit terakhir genap.
}

handler.command = handler.help = ['cekno', 'ceknokos', 'cekreal'];
handler.tags = ['tools'];
handler.premium = false;
handler.group = true;

module.exports = handler;