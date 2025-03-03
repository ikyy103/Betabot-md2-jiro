/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Uploader File To Cdn Anomaki
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

Contributor : sxyz
*/
const axios = require('axios');
const FormData = require('form-data');
const handler = async (m, {
    quoted
}) => {
    const anomakiCdn = async (buffer, fileName) => {
        if (!buffer) throw "⚠️ Tidak ada file untuk diupload.";

        try {
            const form = new FormData();
            form.append("files", buffer, fileName);

            const headers = {
                headers: {
                    ...form.getHeaders()
                }
            };
            const {
                data: response
            } = await axios.post("https://cdn.anomaki.web.id/api/upload", form, headers);
            const validUrl = "https://cdn.anomaki.web.id" + response[0].url;
            return validUrl;
        } catch (error) {
            throw `${error.message}`;
        }
    };

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw "Tidak ada media yang ditemukan.";
    const buffer = await q.download();
    if (!buffer) throw "Gagal Mendownload.";

    const fileName = `upload_${Date.now()}.${mime.split("/")[1]}`;

    try {
        const resultUrl = await anomakiCdn(buffer, fileName);
        const caption = `✅ *Sokses kak*\n\n🌐 URL: ${resultUrl}`;
        await conn.sendMessage(m.chat, {
            image: {
                url: resultUrl
            },
            caption: caption
        }, {
            quoted: m
        });
    } catch (error) {
        await conn.sendMessage(m.chat, {
            text: `${error}`
        }, {
            quoted: m
        });
    }
};

handler.help = ["cdn"];
handler.tags = ["tools"];
handler.command = /^(cdn)$/i;
handler.limit = 2
module.exports = handler;