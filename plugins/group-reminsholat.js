/**
@credit Tio
@Tixo MD
@Whatsapp Bot
@Support dengan Donasi ✨
wa.me/6282285357346
**/

const axios = require('axios');

async function before(m, {
    conn,
    participants
}) {
    conn.autosholat = conn.autosholat || {};
    conn.adz = conn.adz || {};

    let lokasi = 'surabaya';
    let id = m.chat;

    if (id in conn.adz) return;
    if (m.fromMe || !m.isGroup) return;

    if (!(id in conn.autosholat)) {
        let jadwal = await jadwalsholat(lokasi);
        conn.autosholat[id] = {
            jadwal,
            interval: null
        };

        conn.autosholat[id].interval = setInterval(() => {
            const date = new Date(new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta'
            }));
            const timeNow = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            for (const [sholat, waktu] of Object.entries(conn.autosholat[id].jadwal)) {
                if (timeNow === waktu) {
                    if (!conn.adz[id]) {
                        conn.adz[id] = true;

                        const {
                            key
                        } = conn.sendMessage(m.chat, {
                            audio: {
                                url: 'https://media.vocaroo.com/mp3/1ofLT2YUJAjQ'
                            },
                            mimetype: 'audio/mp4',
                            ptt: true,
                            contextInfo: {
                                externalAdReply: {
                                    showAdAttribution: true,
                                    mediaType: 1,
                                    mediaUrl: '',
                                    title: `Selamat menunaikan Ibadah Sholat ${sholat}`,
                                    body: `🕑 ${waktu}`,
                                    sourceUrl: '',
                                    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqvDerKvRfPupGu-tbzMaEFrVmthUoVDppSw&usqp=CAU',
                                    renderLargerThumbnail: true
                                }
                            }
                        }, {
                            quoted: verif,
                            mentions: participants.map(a => a.id)
                        });

                        setTimeout(() => {
                            delete conn.adz[id]
                            conn.sendMessage(m.chat, {
                                delete: key
                            })
                        }, 60000); // Hapus flag setelah 1 menit
                    }
                }
            }
        }, 60000); // Cek setiap menit
    }
}

async function jadwalsholat(kota) {
    try {
        const {
            data
        } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=8`);
        const result = {
            shubuh: data.data.timings.Fajr,
            dhuhur: data.data.timings.Dhuhr,
            ashar: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isya: data.data.timings.Isha
        };
        return result;
    } catch (e) {
        return 'eror 404';
    }
}

module.exports = { before, jadwalsholat };