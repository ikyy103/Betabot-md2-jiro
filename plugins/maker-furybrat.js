const fetch = require("node-fetch");

let handler = async (m, { conn, args }) => {
    let input = args.join(" ").split(",").map(v => v.trim()); // Pisahkan teks berdasarkan koma

    if (!input[0]) return m.reply("🚨 *Error:* Masukkan teks yang ingin dibuat!\n\n*Contoh:* `.furbrat Hi, my name is Hikaru, 3, right, animated`");

    let text = input[0];  
    let style = /^[1-8]$/.test(input[1]) ? input[1] : "1"; // Default: 1
    let position = /^(left|right|justify|center)$/i.test(input[2]) ? input[2] : "center"; // Default: center
    let mode = /^(image|animated)$/i.test(input[3]) ? input[3] : "image"; // Default: image

    let apiUrl = `https://fastrestapis.fasturl.cloud/maker/furbrat?text=${encodeURIComponent(text)}&style=${style}&position=${position}&mode=${mode}`;

    try {
        let response = await fetch(apiUrl);
        let buffer = await response.buffer();
        let fileType = response.headers.get("content-type");

        if (mode === "animated" && fileType === "image/gif") {
            await conn.sendMessage(m.chat, { 
                document: buffer, 
                mimetype: "image/gif",
                fileName: "furbrat.gif",
                caption: `✅ *GIF Furbrat Berhasil Dibuat!*\n\n➤ *Teks:* ${text}\n➤ *Style:* ${style}\n➤ *Posisi:* ${position}\n➤ *Mode:* ${mode}`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { 
                image: buffer, 
                caption: `✅ *Furbrat Image Berhasil Dibuat!*\n\n➤ *Teks:* ${text}\n➤ *Style:* ${style}\n➤ *Posisi:* ${position}\n➤ *Mode:* ${mode}`
            }, { quoted: m });
        }
    } catch (error) {
        console.error(error);
        m.reply("❌ *Error:* Gagal memproses permintaan. Coba lagi nanti!");
    }
};

handler.help = ["furbrat <teks>, <style>, <position>, <mode>"];
handler.tags = ["maker"];
handler.command = /^furbrat$/i;

module.exports = handler;