let handler = async (m, { conn, args, text }) => {
    if (!args[0]) throw `⚠️ Masukkan nama database yang ingin diperiksa!\n\nContoh:\n.fixdb users`;
    
    let databaseName = args[0]; // Nama database yang akan diproses
    let database = global[databaseName]; // Ambil database dari global (contoh global.users)

    if (!database) throw `⚠️ Database dengan nama "${databaseName}" tidak ditemukan!`;

    // Fungsi untuk validasi dan perbaikan data
    const validateAndCorrect = (data) => {
        let correctedData = [];
        let errorLog = [];

        for (let entry of data) {
            let correctedEntry = { ...entry }; // Salin data asli
            let hasError = false;

            // Contoh validasi dan perbaikan
            // 1. Validasi nama (harus string, dan hanya huruf kapital di awal kata)
            if (correctedEntry.name && typeof correctedEntry.name === 'string') {
                correctedEntry.name = correctedEntry.name.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            } else {
                hasError = true;
            }

            // 2. Validasi email
            if (correctedEntry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correctedEntry.email)) {
                correctedEntry.email = correctedEntry.email || 'invalid@example.com';
                hasError = true;
            }

            // 3. Validasi tanggal (harus dalam format YYYY-MM-DD)
            if (correctedEntry.date) {
                const isValidDate = !isNaN(Date.parse(correctedEntry.date));
                if (!isValidDate) {
                    correctedEntry.date = 'Invalid Date';
                    hasError = true;
                }
            }

            if (hasError) errorLog.push(entry);
            correctedData.push(correctedEntry);
        }

        return { correctedData, errorLog };
    };

    // Proses database
    let { correctedData, errorLog } = validateAndCorrect(database);

    // Update database global
    global[databaseName] = correctedData;

    // Kirim hasil ke pengguna
    m.reply(
        `✅ Database "${databaseName}" telah dirapikan!\n\n` +
        `- Total data diperiksa: ${database.length}\n` +
        `- Data yang dikoreksi: ${errorLog.length}\n` +
        `- Data valid: ${correctedData.length - errorLog.length}`
    );

    // Log kesalahan jika ada
    if (errorLog.length > 0) {
        console.error(`❌ Data bermasalah (${errorLog.length}):`, errorLog);
    }
};

handler.help = ['fixdb <namaDatabase>'];
handler.tags = ['owner'];
handler.command = /^fixdb$/i;

handler.owner = true; // Hanya untuk owner

module.exports = handler;