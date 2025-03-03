const fetch = require('node-fetch');

let handler = async (m, { text, conn }) => {
    let args = text.split('|');
    if (args.length < 2) {
        return conn.reply(m.chat, `🚩 Format salah!\n\n*Contoh:* .stalkbank 6289525720818|gopay\n\n💡 Daftar bank yang bisa dicek:\n- gopay\n- ovo\n- dana\n- linkaja\n- bca\n- bri\n- bni\n- mandiri\n- jenius\n- dll.`, m);
    }

    let number = args[0].trim();
    let bank = args[1].trim().toLowerCase();
    let apiUrl = `https://fastrestapis.fasturl.cloud/stalk/bank?number=${number}&bank=${bank}`;

    try {
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (json.status !== 200 || !json.result.status) {
            return conn.reply(m.chat, `🚩 Gagal mendapatkan data akun!\nPastikan nomor dan bank benar.`, m);
        }

        let { account_number, name, bank_code } = json.result.data;
        let message = `✅ *Informasi Akun Bank*\n\n🏦 *Bank:* ${bank_code.toUpperCase()}\n📌 *Nomor:* ${account_number}\n👤 *Nama:* ${name}\n\n💡 Pastikan informasi ini digunakan dengan bijak!`;

        conn.reply(m.chat, message, m);
    } catch (e) {
        console.log(e);
        conn.reply(m.chat, "🚩 Terjadi kesalahan saat mengambil data!", m);
    }
};

handler.help = ['stalkbank'];
handler.tags = ['tools'];
handler.command = /^stalkbank$/i;
handler.limit = true;
module.exports = handler;