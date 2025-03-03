const fetch = require('node-fetch');
const os = require('os');

const handler = async (m, { conn, args }) => {
    const command = args[0]?.toLowerCase();
    const user = global.db.data.users[m.sender];

    class Pelabuhan {
        constructor(user) {
            this.level = user.pelabuhanLevel || 1;
            this.maxPenumpang = user.pelabuhanMaxPenumpang || 10;
            this.saldo = user.pelabuhanSaldo || 100;
            this.pendapatanPerPenumpang = user.pelabuhanPendapatanPerPenumpang || 5;
            this.jumlahPenumpang = user.pelabuhanJumlahPenumpang || 0;
            this.biayaUpgrade = user.pelabuhanBiayaUpgrade || 50;
        }

        upgrade() {
            if (this.saldo >= this.biayaUpgrade) {
                this.saldo -= this.biayaUpgrade;
                this.level++;
                this.maxPenumpang += 5;
                this.pendapatanPerPenumpang += 2;
                this.biayaUpgrade += 50;
                this.saveToDatabase();

                conn.relayMessage(m.chat, {
                    extendedTextMessage: {
                        text: `🎉 *Peningkatan Berhasil!*\n\n🚀 Level Pesawat: ${this.level}\n👥 Max Penumpang: ${this.maxPenumpang}\n💵 Pendapatan/penumpang: ${this.pendapatanPerPenumpang}\n💰 Sisa Saldo: ${this.saldo}`,
                        contextInfo: {
                            externalAdReply: {
                                title: `Level ${this.level} | Saldo: ${this.saldo}`,
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                thumbnailUrl: 'https://telegra.ph/file/cf4f28ed3b9ebdfb30adc.png',
                                sourceUrl: 'https://drakhole.ai/pelabuhan'
                            }
                        }
                    }
                }, {});
            } else {
                conn.reply(m.chat, '❌ Saldo tidak cukup untuk meningkatkan level pesawat!');
            }
        }

        tambahSaldo(jumlah) {
            this.saldo += jumlah;
            this.saveToDatabase();
            conn.reply(m.chat, `✅ Saldo bertambah. Total Saldo: ${this.saldo}`);
        }

        hitungPendapatan() {
            const pendapatan = this.jumlahPenumpang * this.pendapatanPerPenumpang;
            this.saldo += pendapatan;
            this.saveToDatabase();
            conn.reply(m.chat, `💵 Pendapatan: ${pendapatan}\n💰 Total Saldo: ${this.saldo}`);
        }

        info() {
            conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: `🛫 *Informasi Pesawat*\n\n🚀 Level Pesawat: ${this.level}\n👥 Max Penumpang: ${this.maxPenumpang}\n👤 Jumlah Penumpang: ${this.jumlahPenumpang}\n💰 Saldo: ${this.saldo}\n💵 Pendapatan/penumpang: ${this.pendapatanPerPenumpang}\n🔧 Biaya Upgrade: ${this.biayaUpgrade}`,
                    contextInfo: {
                        externalAdReply: {
                            title: `Status Pesawat Level ${this.level}`,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            thumbnailUrl: 'https://telegra.ph/file/plane-thumbnail.png',
                            sourceUrl: 'https://drakhole.ai/status'
                        }
                    }
                }
            }, {});
        }

        tambahPenumpang() {
            if (this.jumlahPenumpang < this.maxPenumpang) {
                this.jumlahPenumpang++;
                this.saveToDatabase();
            }
        }

        bermain(durasiMenit) {
            let menitKe = 0;
            const interval = setInterval(() => {
                menitKe++;
                this.tambahPenumpang();
                const pendapatan = this.jumlahPenumpang * this.pendapatanPerPenumpang;
                this.saldo += pendapatan;
                this.saveToDatabase();

                conn.relayMessage(m.chat, {
                    extendedTextMessage: {
                        text: `⏳ *Update Permainan*\n\n🕒 Menit ke-${menitKe}\n👤 Penumpang: ${this.jumlahPenumpang}\n💵 Pendapatan: ${pendapatan}\n💰 Saldo: ${this.saldo}`,
                        contextInfo: {
                            externalAdReply: {
                                title: `Status Permainan: Menit ${menitKe}`,
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                thumbnailUrl: 'https://telegra.ph/file/game-thumbnail.png',
                                sourceUrl: 'https://drakhole.ai/play'
                            }
                        }
                    }
                }, {});

                if (menitKe >= durasiMenit) {
                    clearInterval(interval);
                    conn.reply(m.chat, '🎮 Permainan selesai!');
                }
            }, 60000);
        }

        saveToDatabase() {
            user.pelabuhanLevel = this.level;
            user.pelabuhanMaxPenumpang = this.maxPenumpang;
            user.pelabuhanSaldo = this.saldo;
            user.pelabuhanPendapatanPerPenumpang = this.pendapatanPerPenumpang;
            user.pelabuhanJumlahPenumpang = this.jumlahPenumpang;
            user.pelabuhanBiayaUpgrade = this.biayaUpgrade;
        }
    }

    const pelabuhan = new Pelabuhan(user);

    switch (command) {
        case 'info':
            pelabuhan.info();
            break;
        case 'upgrade':
            pelabuhan.upgrade();
            break;
        case 'pendapatan':
            pelabuhan.hitungPendapatan();
            break;
        case 'bermain':
            const durasi = parseInt(args[1]) || 5; // Default 5 menit
            pelabuhan.bermain(durasi);
            break;
        default:
            conn.reply(m.chat, `🚀 *Panduan Game Pesawat*\n\n1️⃣ *info* - Tampilkan informasi pesawat\n2️⃣ *upgrade* - Tingkatkan level pesawat\n3️⃣ *pendapatan* - Hitung pendapatan saat ini\n4️⃣ *bermain <durasi>* - Bermain selama <durasi> menit.`);
    }
};

handler.command = /^pesawat$/i;
handler.help = ['pesawat <command>'];
handler.tags = ['game'];
handler.group = true;

module.exports = handler;