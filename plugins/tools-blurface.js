const axios = require("axios");

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("⚠️ Harap masukkan link gambar!");

    let imageUrl = args[0];
    let apiUrl = `https://api.siputzx.my.id/api/iloveimg/blurface?image=${encodeURIComponent(imageUrl)}`;

    try {
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: "*Done boss*"
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply("❌ Terjadi kesalahan! Pastikan link gambar valid.");
    }
};

handler.command = /^(blurface|blurface)$/i;
handler.tags = ["tools"];
handler.help = ["blurface <link_gambar>"];
handler.premium = false;

module.exports = handler;