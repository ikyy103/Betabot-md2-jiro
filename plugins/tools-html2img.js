/*  
  Base : HTML to Image API  
  Telegram : t.me/kayzuMD  
  WhatsApp Channel : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17  
  Type : Plug-in CJS  
  Created by : Kayzu MD 🐦‍⬛  
  Thanks to : htmlcsstoimage.com  
*/

const axios = require("axios");

async function html2image(html, css = "") {
  try {
    const response = await axios.post(
      "https://htmlcsstoimage.com/demo_run",
      {
        html,
        css,
        console_mode: "",
        url: "",
        selector: "",
        ms_delay: "",
        render_when_ready: "false",
        viewport_height: "",
        viewport_width: "",
        google_fonts: "",
        device_scale: "",
      },
      {
        headers: {
          cookie: "_ga=GA1.2.535741333.1711473772;",
          "x-csrf-token": "pO7JhtS8osD491DfzpbVYXzThWKZjPoXXFBi69aJnlFRHIO9UGP7Gj9Y93xItqiCHzisYobEoWqcFqZqGVJsow",
        },
      }
    );

    return response.data.url ? response.data.url : null;
  } catch (error) {
    return null;
  }
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ Masukkan HTML yang ingin dikonversi!');

    // Reaksi proses 🎨
    await conn.sendMessage(m.chat, {
        react: { text: "🎨", key: m.key }
    });

    let html = text;
    let css = "body { font-family: Arial; }"; // CSS default jika tidak ada

    let imageUrl = await html2image(html, css);
    if (!imageUrl) {
        await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
        return m.reply('❌ Gagal mengonversi HTML ke gambar!');
    }

    let caption = `*🖼️ Hasil Konversi HTML ke Gambar*\n\n🔗 *URL:* ${imageUrl}`;

    // Reaksi selesai ✅
    await conn.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
    });

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.command = /^(html2image)$/i;
handler.help = ['html2image (kode HTML)'];
handler.tags = ['tools'];

module.exports = handler;