import moment from 'moment-timezone'; // Gunakan import untuk moment

let handler = async (m, { conn, command }) => {
    switch (command) {
        case "chlist": {
            try {
                // Dapatkan semua ID chat yang berakhir dengan "@newsletter"
                let id = Object.keys(global.db.data.chats).filter(a => a.endsWith("@newsletter"));
                let ar = [];

                for (let i of id) {
                    try {
                        // Mendapatkan metadata secara manual (ganti dengan fungsi sesuai API library Anda)
                        let meta = await conn.groupMetadata(i); // Coba gunakan groupMetadata
                        ar.push({
                            subject: meta.subject || "Unknown", // Nama newsletter
                            id: meta.id || "Unknown", // ID newsletter
                            role: meta.participants?.[m.sender]?.role || "Unknown", // Peran user
                            followers: meta.size?.toLocaleString() || "Unknown", // Jumlah subscribers
                            create: moment(meta.creation * 1000).format("DD/MM/YYYY HH:mm:ss"), // Waktu dibuat
                            picture: meta.picture || "N/A", // Gambar
                            url: "https://whatsapp.com/channel/" + (meta.invite || "Unknown") // URL invite
                        });
                    } catch (err) {
                        console.error(`Error mendapatkan metadata untuk ${i}:`, err);
                    }
                }

                let cap = `*– 乂 N E W S L E T T E R -  L I S T*

${ar.map(a => Object.entries(a).map(([key, val]) => `   ◦ ${key} : ${val}`).join("\n")).join("\n\n")}

> Total Newsletter Chat: ${ar.length}`;

                m.reply(cap);
            } catch (err) {
                console.error(err);
                m.reply("Terjadi kesalahan saat mengambil data newsletter.");
            }
        }
        break;
    }
};

handler.help = handler.command = ["chlist"];
handler.tags = ["info"];

export default handler;