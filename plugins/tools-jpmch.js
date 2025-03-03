📋 *Data dari Pastebin:*

/*
  Tolong Jangan Pernah Hapus Watermark Ini
  Script By : JazxCode
  Name Script : Interindah - Assistant MD 
  Version : V1.0
  Follow Saluran : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11
*/

let channelIDs = new Set(["120363XXXXX@g.us"]); 

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    if (!args[0]) {
        return conn.sendMessage(m.chat, { 
            text: `❌ Format salah!\n\nGunakan:\n
- *${usedPrefix + command} set <id_channel>* → Untuk mengganti ID channel utama
- *${usedPrefix + command} add <id_channel>* → Untuk menambahkan ID channel tanpa mengganti yang ada
- *${usedPrefix + command} send <pesan>* → Untuk mengirim pesan ke semua channel tersimpan

📌 *Contoh:*
${usedPrefix + command} set 120363YYYYY@g.us
${usedPrefix + command} add 120363ZZZZZ@g.us
${usedPrefix + command} send Halo, ini pesan JPM ke semua channel!`
        });
    }

    let action = args[0].toLowerCase();

    if (action === "set") {
        if (!args[1]) return conn.sendMessage(m.chat, { text: "❌ Mohon masukkan ID Channel WhatsApp yang valid!" });
        channelIDs = new Set([args[1]]); 
        return conn.sendMessage(m.chat, { text: `✅ ID Channel utama berhasil diubah ke: *${args[1]}*` });
    }

    if (action === "add") {
        if (!args[1]) return conn.sendMessage(m.chat, { text: "❌ Mohon masukkan ID Channel WhatsApp yang valid!" });
        channelIDs.add(args[1]); 
        return conn.sendMessage(m.chat, { text: `✅ ID Channel *${args[1]}* berhasil ditambahkan ke daftar!` });
    }

    if (action === "send") {
        let messageText = args.slice(1).join(" ");
        if (!messageText) return conn.sendMessage(m.chat, { text: "❌ Mohon masukkan pesan yang ingin dikirim ke channel!" });

        try {
            for (let id of channelIDs) {
                let message = {
                    text: `${messageText}`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        externalAdReply: {
                            title: "Aku Punya Ini",
                            body: "Interindah - Assistant MD",
                            thumbnailUrl: "https://files.catbox.moe/1x3y5c.jpg",
                            sourceUrl: "https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11",
                            mediaType: 1
                        }
                    }
                };
                await conn.sendMessage(id, message);
            }

            return conn.sendMessage(m.chat, { text: `✅ Pesan berhasil dikirim ke semua Channel: *${[...channelIDs].join(", ")}*` });

        } catch (error) {
            console.error(error);
            return conn.sendMessage(m.chat, { text: `❌ Gagal mengirim pesan ke channel.\nError: ${error.message}` });
        }
    }

    return conn.sendMessage(m.chat, { text: "❌ Perintah tidak dikenali. Gunakan `set`, `add`, atau `send`." });
};

handler.help = ['jpmch set <id_channel>', 'jpmch add <id_channel>', 'jpmch send <pesan>'];
handler.tags = ['tools'];
handler.command = ['jpmch'];
handler.limit = false;
handler.premium = true;

module.exports = handler;