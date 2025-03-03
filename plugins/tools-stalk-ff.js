/* 
hanya numpang nama bang
nama : XcodeLinoy
ch : https://whatsapp.com/channel/0029Vak7RGtHwXbHCOZNmL0w
jangan dihapus ya king wm nya supaya tidak seperti dev bot lain😂
*/

const axios = require('axios');

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (command == 'stalkff') {
        if (!text) throw 'Masukkan ID Free Fire Anda!';
        
        m.reply('Sedang mencari, mohon tunggu...');
        
        try {
            let { data } = await axios.get(`https://vapis.my.id/api/ff-stalk?id=${text}`);
            
            if (!data.status) {
                return m.reply('Gagal mendapatkan data, coba lagi nanti.');
            }

            let account = data.data.account;
            let petInfo = data.data.pet_info;
            let guild = data.data.guild;
            let ketuaGuild = data.data.ketua_guild;

            let result = `
*Informasi Akun Free Fire*

🆔 *ID*: ${account.id}
👤 *Nama*: ${account.name}
📈 *Level*: ${account.level}
🔸 *XP*: ${account.xp}
🌍 *Region*: ${account.region}
❤️ *Like*: ${account.like}
📜 *Bio*: ${account.bio}
📅 *Dibuat Pada*: ${account.create_time}
⏰ *Login Terakhir*: ${account.last_login}
🎖️ *Honor Score*: ${account.honor_score}
🔥 *Booyah Pass*: ${account.booyah_pass}
🔰 *Booyah Pass Badge*: ${account.booyah_pass_badge}
🚀 *Evo Access Badge*: ${account.evo_access_badge}
🏆 *Equipped Title*: ${account.equipped_title}
💥 *BR Points*: ${account.BR_points}
⚔️ *CS Points*: ${account.CS_points}

*Informasi Hewan Peliharaan*

🐶 *Nama*: ${petInfo.name}
🔸 *Level*: ${petInfo.level}
🔸 *Tipe*: ${petInfo.type}
🔸 *XP*: ${petInfo.xp}

*Informasi Guild*

🏰 *Nama Guild*: ${guild.name}
🆔 *ID Guild*: ${guild.id}
🔸 *Level Guild*: ${guild.level}
🔸 *Anggota Guild*: ${guild.member}
🔸 *Kapasitas Guild*: ${guild.capacity}

*Informasi Ketua Guild*

📅 *Dibuat Pada*: ${ketuaGuild.create_time}
⏰ *Login Terakhir*: ${ketuaGuild.last_login}
📜 *BP Badges*: ${ketuaGuild.BP_bagdes}
🏆 *BR Points*: ${ketuaGuild.BR_points}
⚔️ *CS Points*: ${ketuaGuild.CS_points}
📈 *Level*: ${ketuaGuild.level}
❤️ *Like*: ${ketuaGuild.like}
👤 *Nama*: ${ketuaGuild.name}
🔰 *Equipped Title*: ${ketuaGuild.equipped_title}
🆔 *ID*: ${ketuaGuild.id}
🔸 *XP*: ${ketuaGuild.xp}
`;

            m.reply(result);
        } catch (err) {
            console.error(err);
            m.reply('Terjadi kesalahan saat memproses permintaanmu.');
        }
    }

    if (command == 'stalkml') {
        let [id, zoneId] = text.split(',');
        if (!id || !zoneId) throw `Contoh: ${usedPrefix + command} 84830127,2169`;

        m.reply('Sedang mencari, mohon tunggu...');
        
        try {
            let { data } = await axios.get(`https://vapis.my.id/api/ml-stalk?id=${id}&zoneid=${zoneId}`);
            
            if (!data.status) {
                return m.reply('Gagal mendapatkan data, coba lagi nanti.');
            }

            let userData = data.data;

            let result = `
*Informasi Akun Mobile Legends*

👤 *Nama Pengguna*: ${userData.data.userNameGame}
🆔 *ID*: ${userData.gameId}
🌍 *Zona*: ${userData.zoneId}
💎 *Level*: ${userData.product.level}
🏆 *Harga*: ${userData.price}
🔥 *Nama Game*: ${userData.product.gameName}
📜 *Metode Pembayaran*: ${userData.product.paymentType}
`;

            m.reply(result);
        } catch (err) {
            console.error(err);
            m.reply('Terjadi kesalahan saat memproses permintaanmu.');
        }
    }
};

handler.help = ['stalkff', 'stalkml'];
handler.tags = ['tools'];
handler.command = /^(stalkff|stalkml)$/i;
handler.limit = true;

module.exports = handler;