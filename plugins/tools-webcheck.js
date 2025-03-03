let axios = require("axios");

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `Gunakan format: *${usedPrefix + command} <url_website>*\n\nContoh:\n${usedPrefix + command} https://example.com`;

    let url = args[0];
    let apiUrl = `https://web-check.xyz/check/${url}`;

    try {
        let response = await axios.get(apiUrl);
        let data = response.data;

        let result = `
🌐 *WEB CHECK REPORT*
🔍 *Website:* ${url}
🕒 *Tanggal Scan:* ${new Date().toLocaleString()}

📌 *Analisis Keseluruhan:*
   - 🔒 *Keamanan:* ${data.security_score}% ✅
   - 🚀 *Performa:* ${data.performance_score}% ⚠️
   - 🔍 *SEO:* ${data.seo_score}% 🟢

📊 *Detail Analisis:*

🔹 *Keamanan:*
   - SSL: *${data.ssl_status}*
   - HTTPS Redirect: *${data.https_redirect ? "Ya ✅" : "Tidak ❌"}*
   - Malware Detected: *${data.malware_detected ? "Ya ⚠️" : "Tidak 🚫"}*
   - Vulnerabilities: *${data.vulnerabilities} ditemukan 🛡️*

🚀 *Performa:*
   - Waktu Muat: *${data.page_load_time} detik ⏳*
   - Size Halaman: *${data.page_size} MB 📄*
   - Requests: *${data.request_count} permintaan 📡*
   - Optimasi Gambar: *${data.image_optimization ? "Baik ✅" : "Kurang ⚠️"}*
   - Gzip Compression: *${data.gzip_compression ? "Ya ✅" : "Tidak ❌"}*

📈 *SEO & Indexing:*
   - Meta Description: *${data.meta_description ? "Ada ✅" : "Tidak ⚠️"}*
   - Alt Text pada Gambar: *${data.alt_text ? "Ada ✅" : "Tidak ⚠️"}*
   - Mobile Friendly: *${data.mobile_friendly ? "Ya ✅" : "Tidak ❌"}*
   - Kecepatan Mobile: *${data.mobile_speed_score}% ⚠️*
   - Struktur Heading: *${data.heading_structure} ✅*

📢 *Rekomendasi Perbaikan:*
   1️⃣ *${data.recommendations[0] || "Tidak ada rekomendasi."}*
   2️⃣ *${data.recommendations[1] || ""}*
   3️⃣ *${data.recommendations[2] || ""}*

🔗 *Sumber Scan:* [Web Check API](https://api.web-check.xyz)
`;

        m.reply(result);
    } catch (error) {
        console.error(error);
        m.reply("❌ Terjadi kesalahan saat mengambil data. Pastikan URL valid atau coba lagi nanti.");
    }
};

handler.help = ["webcheck <url>"];
handler.tags = ["tools"];
handler.command = /^webcheck$/i;
handler.limit = true;

module.exports = handler;