const axios = require('axios');

let handler = async (m, { conn, text, isROwner }) => {
    try {
        if (!isROwner) throw "❌ Perintah ini hanya dapat digunakan oleh *Owner Bot*!";
        if (!text) throw "❌ Harap masukkan deskripsi fitur yang ingin dibuat.\n\nContoh:\n.buatfitur Buat fitur untuk menghitung luas lingkaran berdasarkan jari-jari.";

        const apiUrl = 'https://api.botcahx.eu.org/api/search/openai-chat';
        const apiKey = 'Alwaysjiro'; // Ganti dengan API Key Anda

        const prompt = `buatkan fitur ${text} dan kamu kasih langsung fitur nya tanpa keterangan dan tanpa teks di atas fitur yang bertuliskan JavaScript dan yang paling akhir tidak ada kata untuk mempersilahkan kamu kasih langsung script nya langsung tanpa ada apa pun itu dan kamu tidak perlu kasih di atas script bertuliskan JavaScript kamu hilang kan saja, kamu hilang kan tanda titik di awal dan di akhir script agar terlihat Profesional`;

        m.reply("⏳ Sedang membuat fitur, harap tunggu...");

        // Mengirim permintaan ke API
        const response = await axios.get(apiUrl, {
            params: {
                text: prompt,
                apikey: apiKey
            }
        });

        if (response.data && response.data.result) {
            const script = response.data.result.trim();

            if (!script || script.toLowerCase().includes("contoh script")) {
                throw "❌ Tidak dapat menghasilkan script. Pastikan deskripsi fitur jelas dan detail.";
            }

            m.reply(script);
        } else {
            throw `❌ Tidak dapat menghasilkan script.\n\nRespons API: ${response.data?.message || "Tidak diketahui."}`;
        }
    } catch (error) {
        console.error(error);
        m.reply(`❌ Terjadi kesalahan saat membuat fitur. \n\n*Detail:*\n${error.message || error}`);
    }
};

handler.command = ["buatfitur"];
handler.tags = ["tools"];
handler.help = ["buatfitur <deskripsi>"];
handler.owner = false;
handler.register = true;
handler.premium = true;

module.exports = handler;