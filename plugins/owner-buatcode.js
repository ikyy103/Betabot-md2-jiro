let handler = async (m, { args, usedPrefix }) => {
    try {
        let type = args[0]; // Tipe hadiah
        let reward = parseInt(args[1]); // Jumlah hadiah
        let maxClaims = parseInt(args[2]); // Maksimal klaim
        let expireTime = parseInt(args[3]); // Waktu kedaluwarsa dalam menit

        if (!type || isNaN(reward) || isNaN(maxClaims) || isNaN(expireTime)) {
            throw `❌ Gunakan format:\n${usedPrefix}createcode <tipe_hadiah> <jumlah_hadiah> <maksimal_klaim> <durasi_expired>\n\nContoh: ${usedPrefix}createcode limit 10 5 60`;
        }

        // Pastikan redeemCodes ada dalam database
        if (!global.db.data.redeemCodes) {
            global.db.data.redeemCodes = {};
        }

        // Generate kode unik
        let code = [...Array(10)].map(() => (~~(Math.random() * 36)).toString(36)).join('').toUpperCase();
        let expireTimestamp = Date.now() + expireTime * 60 * 1000; // Konversi menit ke milidetik

        // Simpan kode redeem di database
        global.db.data.redeemCodes[code] = {
            type,
            reward,
            maxClaims,
            claimedBy: [],
            expireTimestamp,
        };

        // Kirimkan respons ke pengguna
        m.reply(
            `🎉 *Kode Redeem Berhasil Dibuat!*\n\n` +
            `🔑 *Kode*: ${code}\n` +
            `🔗 *Link Code*: https://wa.me/6289525720818?text=.redeem%20${code}\n` +
            `🎁 *Hadiah*: ${reward} ${type}\n` +
            `👥 *Maksimal Klaim*: ${maxClaims}\n` +
            `⏰ *Berlaku Hingga*: ${new Date(expireTimestamp).toLocaleString('id')}\n\n` +
            `Gunakan kode ini dengan perintah *${usedPrefix}redeem ${code}*`
        );
    } catch (error) {
        console.error(error);
        m.reply(`❌ Terjadi kesalahan: ${error.message || error}`);
    }
};

handler.help = ['createcode <tipe_hadiah> <jumlah_hadiah> <maksimal_klaim> <durasi_expired>'];
handler.tags = ['owner'];
handler.command = /^(createcode|buatcode)$/i;
handler.owner = true;

module.exports = handler;