/*
Cek Channel ID 
Type : Plugins CJS
Sumber : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11
*/

const handler = async (m, { text, conn }) => {
    try {
        if (!text) return m.reply("❌ Harap masukkan link channel WhatsApp!");
        
        const regex = /https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9-_]+)/;
        const match = text.match(regex);

        if (!match) return m.reply("⚠️ Link channel WhatsApp tidak valid!");

        let channelId = match[2]; 
        let res = await conn.newsletterMetadata("invite", channelId);

        if (!res || !res.id) return m.reply("❌ Gagal mengambil data channel. Periksa kembali link!");
        let teks = `🌟 *Detail Channel WhatsApp* 🌟\n\n`
            + `📌 *ID:* ${res.id}\n`
            + `📢 *Nama:* ${res.name}\n`
            + `👥 *Total Pengikut:* ${res.subscribers.toLocaleString()}\n`
            + `📌 *Status:* ${res.state}\n`
            + `✅ *Verified:* ${res.verification === "VERIFIED" ? "✔ Terverifikasi" : "❌ Tidak Terverifikasi"}\n`;

        return m.reply(teks);
    } catch (error) {
        console.error(error);
        return m.reply("⚠️ Terjadi kesalahan saat mengambil data channel. Coba lagi nanti.");
    }
};

handler.command = ["cekidchi", "idchi"];
module.exports = handler; // Menggunakan module.exports untuk ekspor di CJS