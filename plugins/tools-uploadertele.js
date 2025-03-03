const fetch = require("node-fetch");
const crypto = require("crypto");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");
const axios = require("axios");
const fs = require('fs'); // Menghapus 'node:' karena tidak diperlukan
const fakeUserAgent = require("fake-useragent");
const cheerio = require("cheerio");

const uloadUrlRegexStr = /url: "([^"]+)"/;
const randomBytes = crypto.randomBytes(5).toString("hex");

let handler = async (m, { usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    if (!q) throw `Kirim foto trus ketik .tourltele \\ reply foto trus .tourltele`;

    if (q.msg && q.msg.mimetype && /image|webp/.test(q.msg.mimetype)) {
        let media = await (m.quoted ? m.quoted.download() : m.download());

        const { ext, mime } = await fromBuffer(media);
        let filename = './tmp/' + Date.now() + '.' + ext;
        fs.writeFileSync(filename, media);
        const { uploadedLinks } = await Telegraph(filename);
        fs.unlinkSync(filename);
        m.reply(`*乂 U P L O A D E R*
  ◦ Provider : TelegaraPh
  ◦ Size : ${Func.formatSize(media.length)}
  ◦ Url : ${uploadedLinks[0]}

© Simple WhatsApp bot by Nazir`);
    } else if (q.msg && q.msg.mimetype && /audio|video/.test(q.msg.mimetype)) {
        let provi = Object.keys(Uploader).getRandom();
        let media = await (m.quoted ? m.quoted.download() : m.download());

        //- Blacklist 
        delete Uploader.telegraPh;
        delete Uploader.videy;
        delete Uploader.doods;
        //- Blacklist 

        let link = `*乂 F I L E - U P L O A D E R*
  ◦ Provider : ${provi.capitalize()}
  ◦ Size : ${Func.formatSize(media.length)}
  ◦ Url : ${await Uploader[provi](media)}

© Simple WhatsApp bot by Nazir`;
        m.reply(link.trim());
    } else {
        m.reply(`Kirim foto trus ketik .tourltele \\ reply foto trus .tourltele`);
    }
}

handler.help = ["tourltele", "uploadtele"].map((a) => a + " *[reply/send media]*");
handler.tags = ["tools"];
handler.command = ["tourltele", "uploadtele"];

module.exports = handler;

const createFormData = (content, fieldName, ext) => {
    const { mime } = fromBuffer(content) || {};
    const formData = new FormData();
    formData.append(fieldName, content, `${randomBytes}.${ext}`);
    return formData;
};

const Telegraph = async (path) => {
    try {
        let d = new FormData();
        d.append("images", fs.createReadStream(path));

        let h = {
            headers: {
                ...d.getHeaders()
            }
        }

        let { data: uploads } = await axios.post("https://telegraph.zorner.men/upload", d, h);
        return {
            uploadedLinks: uploads.links
        }
    } catch (e) {
        console.error(e.message);
        throw new Error("Failed to upload to Telegraph"); // Menambahkan error handling
    }
}