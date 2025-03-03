module.exports = {
    before: async function (m) {
        this.automakan = this.automakan || {};
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
        let id = m.chat;

        // **Jadwal Makan Selama Puasa**
        let jadwalmakan = {
            sahur: "04:30",
            berbuka: "18:00"
        };

        const date = new Date((new Date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        let isActive = Object.values(this.automakan).includes(true);

        if (id in this.automakan && isActive) return false;

        for (const [makan, waktu] of Object.entries(jadwalmakan)) {
            if (timeNow === waktu && !(id in this.automakan)) {
                let pesan;
                if (makan === "sahur") {
                    pesan = `🌙 *Selamat Sahur!* 🌙\n\nHai @${who.split`@`[0]},\nSaatnya sahur! Jangan lupa makan yang bergizi agar puasamu lancar seharian! 🥣\n\n🕓 *${waktu} WIB*`;
                } else if (makan === "berbuka") {
                    pesan = `🌅 *Waktunya Berbuka!* 🌅\n\nHai @${who.split`@`[0]},\nAlhamdulillah, saatnya berbuka puasa! Jangan lupa awali dengan yang manis! 🍹\n\n🕕 *${waktu} WIB*`;
                }

                this.automakan[id] = [
                    this.reply(m.chat, pesan, null, { contextInfo: { mentionedJid: [who] } }),
                    setTimeout(() => {
                        delete this.automakan[id];
                    }, 60000) // Hapus status setelah 1 menit
                ];
            }
        }
    },
    disabled: false
};