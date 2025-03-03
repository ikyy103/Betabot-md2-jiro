const fetch = require("node-fetch");
const { generateWAMessageFromContent } = require("@adiwajshing/baileys");

let handler = async (m, { conn }) => {
    let fxy; // isi link kalo ada
    try {
        fxy = await conn.profilePictureUrl(m.sender, 'image');
    } catch (e) {
        // Handle error jika tidak bisa mendapatkan profile picture
    }

    let msg = await generateWAMessageFromContent(m.chat, {
        locationMessage: {
            degreesLatitude: 0,
            degreesLongitude: 0,
            name: '𝗖𝗟𝗜𝗖𝗞 𝗛𝗘𝗥𝗘',
            address: wm,
            url: gc,
            isLive: true,
            accuracyInMeters: 0,
            speedInMps: 0,
            degreesClockwiseFromMagneticNorth: 2,
            comment: '',
            jpegThumbnail: await (await fetch(fxy)).buffer()
        }
    }, { quoted: m });

    return await conn.relayMessage(m.chat, msg.message, {});
}

handler.help = ["gcbots"];
handler.tags = ["info"];
handler.command = /^gcbots$/;
handler.owner = false;

module.exports = handler;