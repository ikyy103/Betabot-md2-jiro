/*
Jangan Hapus Wm Bang 

*Animbrat Maker Plugins Cjs*

*[Sumber API]*
https://fastrestapis.fasturl.cloud/maker/animbrat

*/

const axios = require("axios");

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Masukkan teks dan mode dengan format:\n*animbrat <teks> | <mode>*\n\nContoh:\n.animbrat Hi, my name is Hikaru | image\n.animbrat Welcome | animated");

    let [inputText, mode] = text.split("|").map(v => v.trim());
    if (!mode || !["image", "animated"].includes(mode.toLowerCase())) {
        return m.reply("Mode hanya bisa *image* atau *animated*.\n\nContoh:\n.animbrat Hello | image\n.animbrat Welcome | animated");
    }

    let apiUrl = `https://fastrestapis.fasturl.cloud/maker/animbrat?text=${encodeURIComponent(inputText)}&position=center&mode=${mode.toLowerCase()}`;

    try {
        if (mode.toLowerCase() === "image") {
            await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: `Animbrat Maker\nMode: Image` });
        } else if (mode.toLowerCase() === "animated") {
            await conn.sendMessage(m.chat, { video: { url: apiUrl }, caption: `Animbrat Maker\nMode: Animated` });
        }
    } catch (e) {
        console.log(e);
        m.reply("Gagal mengambil hasil dari server, coba lagi nanti.");
    }
}

handler.help = ['animbrat'];
handler.tags = ['maker'];
handler.command = ['animbrat'];

module.exports = handler;