let handler = async (m, { args, usedPrefix, command }) => {
    try {
        let fileName = args[0]; // Nama file tujuan
        let script = args.slice(1).join(' '); // Script yang ingin ditambahkan

        // Validasi input
        if (!fileName || !script) {
            throw `❌ Gunakan format:\n${usedPrefix}${command} <nama_file> <script>\n\nContoh:\n${usedPrefix}${command} owner-handler.js const handler = async (m) => { m.reply('Hello!') }`;
        }

        // Contoh data lokasi penempatan (hardcoded untuk demonstrasi)
        let recommendations = {
            "owner-handler.js": {
                line: 10,
                clueAbove: "if (!global.db.data.redeemCodes) {\n    global.db.data.redeemCodes = {};\n}",
                clueBelow: "m.reply('Redeem code berhasil dibuat!');"
            },
            "config.js": {
                line: 5,
                clueAbove: "let config = {",
                clueBelow: "}; // Akhir konfigurasi"
            },
            "rpg.js": {
                line: 20,
                clueAbove: "// Fungsi utama RPG",
                clueBelow: "// Akhir fungsi RPG"
            }
        };

        // Periksa apakah file direkomendasikan
        let recommendation = recommendations[fileName];
        if (!recommendation) {
            throw `❌ File *${fileName}* tidak ditemukan dalam daftar rekomendasi. Silakan pastikan nama file benar atau konsultasikan dengan owner bot.`;
        }

        // Format respons
        let response = `✅ *Rekomendasi Penempatan Script*\n\n` +
            `📂 *File*: ${fileName}\n` +
            `📜 *Script*: \n\n${script}\n\n` +
            `📌 *Baris Ke*: ${recommendation.line}\n` +
            `🔍 *Clue*: \n` +
            `  ◦ *Atas*: ${recommendation.clueAbove}\n` +
            `  ◦ *Bawah*: ${recommendation.clueBelow}\n\n` +
            `📝 Pastikan script ditempatkan dengan benar sesuai petunjuk di atas!`;

        m.reply(response);
    } catch (error) {
        console.error(error);
        m.reply(error.message || '❌ Terjadi kesalahan saat memberikan rekomendasi. Pastikan format command dan input sudah benar.');
    }
};

handler.help = ['rcmd <nama_file> <script>'];
handler.tags = ['tools'];
handler.command = /^rcmd$/i;

module.exports = handler;