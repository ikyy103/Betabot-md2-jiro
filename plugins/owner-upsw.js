const fetch = require("node-fetch");
const uploadFile = require("../lib/uploadFile.js");
const uploadImage = require("../lib/uploadImage.js");
const { generateWAMessageFromContent, jidNormalizedUser  } = require("@adiwajshing/baileys");

const mimeAudio = "audio/mpeg";
const mimeVideo = "video/mp4";
const mimeImage = "image/jpeg";

let handler = async (m, { conn, command, args }) => {
  try {
    let teks;
    if (args.length >= 1) {
      teks = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
      teks = m.quoted.text;
    }

    if (!m.quoted) {
      return conn.reply(m.chat, "❌ Balas pesan dengan media atau teks untuk diunggah.", m);
    }

    const mtype = m.quoted.mtype;
    let type;
    let link;

    if (mtype === "audioMessage") {
      type = "vn";
      link = await uploadFile(await m.quoted.download());
    } else if (mtype === "videoMessage") {
      type = "vid";
      link = await uploadFile(await m.quoted.download());
    } else if (mtype === "imageMessage") {
      type = "img";
      link = await uploadImage(await m.quoted.download());
    } else if (mtype === "extendedTextMessage") {
      type = "txt";
    } else {
      throw "❌ Media type tidak valid!";
    }

    const doc = {};
    if (type === "vn") {
      doc.mimetype = mimeAudio;
      doc.audio = { url: link };
    } else if (type === "vid") {
      doc.mimetype = mimeVideo;
      doc.caption = teks;
      doc.video = { url: link };
    } else if (type === "img") {
      doc.mimetype = mimeImage;
      doc.caption = teks;
      doc.image = { url: link };
    } else if (type === "txt") {
      doc.text = teks;
    }

    // Mendapatkan daftar grup
    let groupIds = Object.keys(conn.chats).filter(chatId => conn.chats[chatId].isGroup);

    // Mengirim pesan ke semua grup
    for (let groupId of groupIds) {
      const group = await conn.groupMetadata(groupId);
      const participants = group.participants.map(member => member.id);

      // Mengirim status
      await conn.sendMessage("status@broadcast", doc, {
        statusJidList: participants,
      });

      // Mengirim pesan ke grup dengan tag
      const message = await generateWAMessageFromContent(groupId, {
        text: teks,
        mentions: participants // Menyebutkan semua peserta grup
      }, { quoted: m });

      await conn.relayMessage(groupId, message.message, {
        messageId: message.key.id,
        statusJidList: participants,
      });
    }

    conn.reply(m.chat, `✅ Sukses mengunggah ke status di ${groupIds.length} grup`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❌ Terjadi kesalahan: ${error.message}`, m);
  }
};

handler.command = /^upsw$/i;
handler.owner = true; // Hanya untuk owner
module.exports = handler;