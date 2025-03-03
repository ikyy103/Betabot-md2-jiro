const fs = require("fs");
const path = require("path");
const { useMultiFileAuthState } = require("@adiwajshing/baileys");

let handler = async (m, { conn, args }) => {
    let targetJid = args[0];

    if (!targetJid) return m.reply("⚠️ *Example:* .updatejadibot 6281234567890");
    if (!global.conns.some(bot => bot.user.jid.includes(targetJid))) return m.reply("❌ Jadibot tidak ditemukan!");

    m.reply("🔄 *Memperbarui sistem Jadibot...*");

    let authPath = `./session_jadibot/${targetJid}`;
    if (fs.existsSync(authPath)) {
        try {
            // Hapus session lama
            fs.rmSync(authPath, { recursive: true, force: true });

            // Buat session baru
            let { state, saveCreds } = await useMultiFileAuthState(authPath);
            let msgRetryCounterCache = new (require("node-cache"))();
            let newConn = require("../lib/simple").makeWASocket({
                logger: require("pino")({ level: "fatal" }),
                auth: { creds: state.creds, keys: require("@adiwajshing/baileys").makeCacheableSignalKeyStore(state.keys) },
                msgRetryCounterCache,
            });

            // Ganti Jadibot lama dengan yang baru
            global.conns = global.conns.map(bot => (bot.user.jid === targetJid ? newConn : bot));

            m.reply("✅ *Jadibot berhasil diperbarui!*");
        } catch (error) {
            console.error("❌ Gagal memperbarui Jadibot:", error);
            m.reply("⚠️ Terjadi kesalahan saat memperbarui Jadibot!");
        }
    } else {
        m.reply("⚠️ Tidak ada sesi Jadibot yang ditemukan!");
    }
};

handler.help = ["updatejadibot *<number>*"]
handler.tags = ["jadibot", "premium"];
handler.command = /^updatejadibot$/i;
handler.owner = false;
handler.premium = true;

module.exports = handler;