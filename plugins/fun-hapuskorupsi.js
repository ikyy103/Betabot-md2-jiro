/*

# Fitur : Hapus Korupsi
# Type : Plugins CJS
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : -

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

let handler = async (m, { conn }) => {
    let teks = [
        '🔍 Mendeteksi korupsi di sistem...',
        '🕵️‍♂️ Melacak para koruptor...',
        '🎯 Target ditemukan, menyiapkan eksekusi...',
        '🔪 Membunuh koruptor pertama...',
        '🔪 Membunuh koruptor kedua...',
        '🔪 Membunuh koruptor ketiga...',
        '⚠️ Koruptor semakin banyak, menambah kecepatan eksekusi...',
        '💀 Membantai para pengemplang pajak...',
        '💸 Mengambil kembali uang rakyat...',
        '🔄 Melanjutkan pembersihan...',
        '🚨 Koruptor mulai panik dan bersembunyi...',
        '💣 Menghancurkan tempat persembunyian koruptor...',
        '📉 Negara mulai membaik...',
        '❌ ERROR: Terlalu banyak koruptor, sistem kewalahan...',
        '🛑 Maaf, sistem gagal membantai karena di negara ini terlalu banyak yang korupsi...'
    ];

    for (let i = 0; i < teks.length; i++) {
        await m.reply(teks[i]);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
};

handler.tags = ['fun'];
handler.help = ['hapuskorupsi'];
handler.command = /^(hapuskorupsi)$/i;

module.exports = handler;